import React, { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/board/Board.js";
import axios from "axios";

function App() {
  const CLIENT_ID = "15e7a2fcae3740a8938ac5edf8460262";
  const REDIRECT_URI = "https://heuristic-archimedes-a074dd.netlify.app/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [cover, setCover] = useState("https://dummyimage.com/300x300/000/fff");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [audio, setAudio] = useState(
    "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
  );
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
    console.log(data);
    const playlistsInformation = data.data.items;

    const playlistId =
      playlistsInformation[
        Math.floor(Math.random() * playlistsInformation.length)
      ].id;

    return playlistId;
  };

  const likedSongInformation = async () => {
    const data = await axios.get("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 50,
      },
    });
    let randomSong = "";
    let songId = "";
    let songName = "";
    let count = 0;
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
        songName.length > 7 ||
        /\d/.test(randomSong.track.name) === true
      ) {
        validSong = false;
        console.log("bad", songName, randomSong.track.name);
        count++;
        console.log(count);
      }
      if (count > 30) {
        songName = "";
        songId = "";
        break;
      }
    }
    console.log(songId);
    if (/\d/.test(songName) === true) {
      console.log("contains number");
    }
    if (songName !== "") {
      setName(songName);
    }
    return songId;
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
    let count = 0;
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
        songName.length > 7 ||
        /\d/.test(randomSong.track.name) === true
      ) {
        validSong = false;
        console.log("bad", songName, randomSong.track.name);
        count++;
        console.log(count);
      }
      if (count > 30) {
        songName = "";
        songId = "";
        break;
      }
    }
    console.log(songId);
    if (/\d/.test(songName) === true) {
      console.log("contains number");
    }
    if (songName !== "") {
      setName(songName);
    }
    return songId;
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

  const songPreview = async (id) => {
    const data = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id,
      },
    });
    setAudio(data.data.preview_url);
  };

  const playSong = () => {
    var song = document.getElementById("audio");
    song.play();
  };

  const userPlaylist = async () => {
    const id = await songInformation();
    await songPreview(id);
    setShow(false);
    setId(id);
    if (id === "") {
      window.alert("Unable to locate valid song! Try again");
    } else {
      await songImage(id);
    }
  };

  const userLiked = async () => {
    const id = await likedSongInformation();
    await songPreview(id);
    setShow(false);
    setId(id);
    if (id === "") {
      window.alert("Unable to locate valid song! Try again");
    } else {
      await songImage(id);
    }
  };

  return (
    <div className="App">
      <div className="yo">
        {!token ? (
          <a
            className="login"
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        {token ? (
          <button onClick={userPlaylist}>Playlist</button>
        ) : (
          <h2>Please Login</h2>
        )}
        {token ? <button onClick={userLiked}>Liked</button> : <p></p>}
        {token ? (
          <button onClick={() => setShow((s) => !s)}>Show Cover</button>
        ) : (
          <p></p>
        )}
        {token ? <button onClick={playSong}>Play Audio</button> : <p></p>}
        <audio id="audio" src={audio}></audio>
        <div style={{ visibility: show ? "visible" : "hidden" }}>
          <img src={cover} alt="Music cover" id="cover"></img>
        </div>
      </div>

      <Board title={name} />
    </div>
  );
}

export default App;
