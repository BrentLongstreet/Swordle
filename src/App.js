import React, { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/board/Board.js";
import axios from "axios";
import Image from "./images/placeholder.jpg";

function App() {
  const CLIENT_ID = "15e7a2fcae3740a8938ac5edf8460262";
  const REDIRECT_URI = "https://heuristic-archimedes-a074dd.netlify.app";
  //http://localhost:3000/
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const scope = "user-library-read";
  const [token, setToken] = useState("");
  const [cover, setCover] = useState(Image);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [audio, setAudio] = useState("");

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
    pauseSong();
    let img = document.getElementById("cover").style;
    img.visibility = "hidden";
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
    //Math.floor(Math.random() * playlistsInformation.length
    return playlistId;
  };

  const likedSongInformation = async () => {
    const data = await axios.get("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 50,
        market: "US",
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
        count++;
      }
      if (count > 30) {
        songName = "";
        songId = "";
        break;
      }
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
        params: {
          market: "US",
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
        songName.length > 15 ||
        /\d/.test(randomSong.track.name) === true
      ) {
        validSong = false;
        count++;
      }
      if (count > 30) {
        songName = "";
        songId = "";
        break;
      }
    }
    if (songName !== "") {
      setName(songName);
    }
    return songId;
  };

  const songImage = async (id) => {
    if (id == "") {
      return;
    } else {
      const data = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
          market: "US",
        },
      });
      setCover(data.data.album.images[1].url);
      let img = document.getElementById("cover").style;
      if (img.visibility === "") {
        img.visibility = "hidden";
      } else if (img.visibility == "hidden") {
        img.visibility = "visible";
      } else {
        img.visibility = "hidden";
      }
    }
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

  const playSong = async () => {
    if (audio === null) {
      alert("Preview UNAVAILABLE for this song!");
    } else {
      let song = document.getElementById("audio");
      song.volume = 0.05;
      song.play();
    }
  };

  const pauseSong = () => {
    let song = document.getElementById("audio");
    song.pause();
  };

  const userPlaylist = async () => {
    let song = document.getElementById("audio");
    song.pause();
    setAudio("");
    const id = await songInformation();
    await songPreview(id);
    await songImage(id);
    let img = document.getElementById("cover").style;
    img.visibility = "hidden";
    setId(id);
  };

  const userLiked = async () => {
    let song = document.getElementById("audio");
    song.pause();
    setAudio("");
    const id = await likedSongInformation();
    await songPreview(id);
    await songImage(id);
    let img = document.getElementById("cover").style;
    img.visibility = "hidden";
    setId(id);
  };

  return (
    <div className="App">
      <div className="yo">
        {!token ? (
          <a
            className="login"
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
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
          <button
            onClick={() => {
              songImage(id);
            }}
          >
            Show Cover
          </button>
        ) : (
          <p></p>
        )}
        {token ? <button onClick={playSong}>Play Audio</button> : <p></p>}
        {token ? <button onClick={pauseSong}>Pause Audio</button> : <p></p>}
        <audio id="audio" src={audio}></audio>
      </div>
      <img src={cover} alt="Music cover" id="cover"></img>

      <Board title={name} />
    </div>
  );
}

export default App;
