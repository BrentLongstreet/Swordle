import { useEffect, useState } from "react";
import "./board.css";

function Board() {
  const [style, setStyle] = useState("repeat(10, 1fr)");

  const createSquares = () => {
    const gameBoard = document.getElementById("board");
    gameBoard.style.gridTemplateColumns = style;
    while (gameBoard.firstChild) {
      gameBoard.firstChild.remove();
    }
    let rows = style.substring(style.indexOf("(") + 1, style.lastIndexOf(","));
    for (let index = 0; index < rows * 5; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  };

  useEffect(() => {
    createSquares();
  }, []);

  const update = () => {
    setStyle("repeat(15, 1fr)");
    const gameBoard = document.getElementById("board");
    gameBoard.style.gridTemplateColumns = style;
    createSquares();
  };
  return (
    <div id="container">
      <div id="game">
        <header>
          <h1 class="title">WORDLE</h1>
        </header>
        <button id="chop" onClick={update}>
          HIT ME
        </button>
        <div id="board-container">
          <div id="board" style={{ gridTemplateColumns: style }}></div>
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
