import { useEffect, useState } from "react";
import "./board.css";

function Board({ title }) {
  const [style, setStyle] = useState(`repeat(${title.length}, 1fr)`);

  useEffect(() => {
    setStyle(`repeat(${title.length}, 1fr)`);
    createSquares();
  });

  const createSquares = () => {
    const gameBoard = document.getElementById("board");
    while (gameBoard.firstChild) {
      gameBoard.firstChild.remove();
    }
    gameBoard.style.gridTemplateColumns = style;
    for (let index = 0; index < title.length * 5; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  };
  let guessedWords = [[]];
  let availableSpace = 1;

  const getCurretWordArr = () => {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  };

  const updateGuessedWords = (letter) => {
    const currentWordArr = getCurretWordArr();

    if (currentWordArr && currentWordArr.length < title.length) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));

      availableSpace = availableSpace + 1;
      availableSpaceEl.textContent = letter;
    }
  };

  const keys = document.querySelectorAll(".keyboard-row button");
  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");
      console.log(letter);

      updateGuessedWords(letter);
    };
  }
  return (
    <div id="container">
      <div id="game">
        <header>
          <h1 class="title">{title.length}</h1>
        </header>

        <div id="board-container">
          <div id="board"></div>
        </div>

        <div id="keyboard-container">
          <div class="keyboard-row">
            <button data-key="q">q</button>
            <button data-key="w">w</button>
            <button data-key="e">e</button>
            <button data-key="r">r</button>
            <button data-key="t">t</button>
            <button data-key="y">y</button>
            <button data-key="u">u</button>
            <button data-key="i">i</button>
            <button data-key="o">o</button>
            <button data-key="p">p</button>
          </div>
          <div class="keyboard-row">
            <div class="spacer-half"></div>
            <button data-key="a">a</button>
            <button data-key="s">s</button>
            <button data-key="d">d</button>
            <button data-key="f">f</button>
            <button data-key="g">g</button>
            <button data-key="h">h</button>
            <button data-key="j">j</button>
            <button data-key="k">k</button>
            <button data-key="l">l</button>
            <div class="spacer-half"></div>
          </div>
          <div class="keyboard-row">
            <button data-key="enter" class="wide-button">
              Enter
            </button>
            <button data-key="z">z</button>
            <button data-key="x">x</button>
            <button data-key="c">c</button>
            <button data-key="v">v</button>
            <button data-key="b">b</button>
            <button data-key="n">n</button>
            <button data-key="m">m</button>
            <button data-key="del" class="wide-button">
              Del
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
