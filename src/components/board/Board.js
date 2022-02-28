import { useEffect, useState } from "react";
import "./board.css";
import "animate.css";
let score = 0;
let streak = 0;

function Board({ title, getAmountGuessed }) {
  let guessedCorrectWord = false;
  let guessedWords = [[]];
  let availableSpace = 1;
  let guessedWordCount = 0;
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
    for (let index = 0; index < title.length * 4; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  };
  const getCurrentWordArr = () => {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  };
  const getTileColor = (letter, index) => {
    const isCorrectLetter = title.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58,58,60";
    }

    const letterInThatPosition = title.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83,141,78)";
    }

    return "rgb(181,159,59)";
  };

  const handleSubmitWord = () => {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== title.length) {
      window.alert(`Word must be ${title.length} letters`);
      return;
    }

    const currentWord = currentWordArr.join("");

    const firstLetterId = guessedWordCount * title.length + 1;
    const interval = 200;
    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = getTileColor(letter, index);

        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.classList.add("animate__flipInX");
        letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
      }, interval * index);
    });
    guessedWordCount += 1;
    if (
      guessedWords.length === 4 &&
      currentWord !== title &&
      currentWordArr.length === title.length
    ) {
      window.alert(`You have no more guesses! The song name was ${title}`);
      streak = 0;
      document.getElementById("streak").textContent = streak;
    }
    if (currentWordArr.length === title.length) {
      guessedWords.push([]);
    }
    if (currentWord === title) {
      score += 500;
      streak += 1;
      document.getElementById("score").textContent = score;
      document.getElementById("streak").textContent = streak;
      guessedCorrectWord = true;
    }
  };

  const handleDeleteLetter = () => {
    const currentWordArr = getCurrentWordArr();
    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace = availableSpace - 1;
  };

  const updateGuessedWords = (letter) => {
    const currentWordArr = getCurrentWordArr();

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
      const letter = target.getAttribute("data-key").toUpperCase();
      if (guessedCorrectWord === true) {
        alert("You just guessed this song! Try another.");
      } else if (letter === "ENTER") {
        handleSubmitWord();
        return;
      } else if (letter === "DEL") {
        handleDeleteLetter();
        return;
      } else {
        updateGuessedWords(letter);
      }
    };
  }
  return (
    <div id="container">
      <div id="game">
        <header>
          <div className="score">
            <h1 className="title" id="score">
              {score}
            </h1>
            <h1 className="label">Score</h1>
          </div>
          <div className="letters">
            <h1 className="title">{title.length}</h1>
            <h1 className="label">Letters</h1>
          </div>
          <div className="streak">
            <h1 className="title" id="streak">
              {streak}
            </h1>
            <h1 className="label">Streak</h1>
          </div>
        </header>

        <div id="board-container">
          <div id="board"></div>
        </div>

        <div id="keyboard-container">
          <div className="keyboard-row">
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
          <div className="keyboard-row">
            <div className="spacer-half"></div>
            <button data-key="a">a</button>
            <button data-key="s">s</button>
            <button data-key="d">d</button>
            <button data-key="f">f</button>
            <button data-key="g">g</button>
            <button data-key="h">h</button>
            <button data-key="j">j</button>
            <button data-key="k">k</button>
            <button data-key="l">l</button>
            <div className="spacer-half"></div>
          </div>
          <div className="keyboard-row">
            <button data-key="enter" className="wide-button">
              Enter
            </button>
            <button data-key="z">z</button>
            <button data-key="x">x</button>
            <button data-key="c">c</button>
            <button data-key="v">v</button>
            <button data-key="b">b</button>
            <button data-key="n">n</button>
            <button data-key="m">m</button>
            <button data-key="del" className="wide-button">
              Del
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
