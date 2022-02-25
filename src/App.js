import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/board/Board.js";
import axios from "axios";

function App() {
  const CLIENT_ID = "15e7a2fcae3740a8938ac5edf8460262";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [cover, setCover] = useState(
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
  );
  const [name, setName] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
    console.log(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const playlistId = async () => {
    const data = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const playlistsInformation = data.data.items;

    const playlistId =
      playlistsInformation[
        Math.floor(Math.random() * playlistsInformation.length)
      ].id;

    return playlistId;
  };

  const songInformation = async () => {
    const id = await playlistId();
    const data = await axios.get(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let randomSong = "";
    let songId = "";
    let songName = "";
    let validSong = false;
    while (!validSong) {
      validSong = true;
      randomSong =
        data.data.items[Math.floor(Math.random() * data.data.items.length)];

      songId = randomSong.track.id;
      songName = randomSong.track.name
        .replace(/[^a-zA-Z]/g, "")
        .split(" (")[0]
        .split(" -")[0]
        .toUpperCase()
        .split("FEAT")[0];

      if (
        songName.length < 4 ||
        songName.length > 13 ||
        /\d/.test(randomSong.track.name) === true
      ) {
        validSong = false;
        console.log("bad", songName, randomSong.track.name);
      }
    }

    if (/\d/.test(songName) === true) {
      console.log("contains number");
    }
    setName(songName);
    return { id: songId, name: songName };
  };

  const songImage = async (id) => {
    const data = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id,
      },
    });
    setCover(data.data.album.images[1].url);
  };

  const userPlaylist = async () => {
    const songInfo = await songInformation();
    await songImage(songInfo["id"]);
  };
  return (
    <div className="App">
      <div className="yo">
        <h1>Spotify</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        {token ? (
          <button onClick={userPlaylist}>Click</button>
        ) : (
          <h2>Please Login</h2>
        )}
      </div>

      <img src={cover} alt="Music cover"></img>
      <h2>{name}</h2>
      <Board title={name} />
    </div>
  );
}

export default App;
