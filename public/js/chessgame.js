const socket = io();
const chess = Chess();
const boardElement = document.querySelector(".chessBoard");
const overlay = document.getElementById("overlay");
const gameBoard = document.getElementById("gameBoard");

let draggedPeice = null;
let sourceSquare = null;
let playerRole = null;

const getPeiceUnicode = (peice) => {
  const unicodePieces = {
    p: "♙",
    r: "♜",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
    P: "♙",
    R: "♜",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
  };
  return unicodePieces[peice.type] || "";
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };
  socket.emit("move", move);
};

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = null;
  board.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = squareIndex;

      if (square) {
        const peiceElement = document.createElement("div");
        peiceElement.classList.add(
          "peice",
          square.color === "w" ? "white" : "black"
        );
        peiceElement.innerText = getPeiceUnicode(square);
        peiceElement.draggable = playerRole === square.color;

        peiceElement.addEventListener("dragstart", function (e) {
          if (peiceElement.draggable) {
            draggedPeice = peiceElement;
            sourceSquare = { row: rowIndex, col: squareIndex };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        peiceElement.addEventListener("dragend", function (e) {
          draggedPeice = null;
          sourceSquare = null;
        });

        squareElement.appendChild(peiceElement);
      }

      squareElement.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPeice) {
          const targetSource = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };

          handleMove(sourceSquare, targetSource);
        }
      });
      boardElement.appendChild(squareElement);
    });
  });

  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

socket.on("playerRole", function (role) {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", function () {
  playerRole = null;
  renderBoard();
});

socket.on("boardState", function (fen) {
  chess.load(fen);
  renderBoard();
});

socket.on("move", function (move) {
  chess.move(move);
  renderBoard();
});

socket.on("gameOver", function (message) {
  console.log("game over", message);
  overlay.innerText = `${message} \n Click here to restart`;
  overlay.classList.remove("hidden");
  gameBoard.classList.add("hidden");
  showGameOverPopup(message);
});

overlay.addEventListener("click", () => {
  socket.emit("restartGame");
  overlay.classList.add("hidden");
  gameBoard.classList.remove("hidden");
});

socket.on("checkPlayers", (playersReady) => {
  if (playersReady) {
    overlay.classList.add("hidden");
    gameBoard.classList.remove("hidden");
  } else {
    overlay.classList.remove("hidden");
    overlay.innerText = "Waiting for other player to join...";
    gameBoard.classList.add("hidden");
  }
});

socket.on("playerDisconnected", (data) => {
  overlay.innerText = `${data.player} left. ${data.result} \n Click here to restart`;
  overlay.classList.remove("hidden");
  gameBoard.classList.add("hidden");
});

const showGameOverPopup = (message) => {
  const popup = document.createElement("div");
  popup.classList.add("game-over-popup");

  const messageElement = document.createElement("p");
  messageElement.innerText = message;
  popup.appendChild(messageElement);

  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.addEventListener("click", function () {
    socket.emit("restartGame");
    document.body.removeChild(popup);
  });
  popup.appendChild(restartButton);

  document.body.appendChild(popup);
};

const style = document.createElement("style");
style.innerHTML = `
  .game-over-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #333;
    color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .game-over-popup button {
    margin-top: 10px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .game-over-popup button:hover {
    background-color: #45a049;
  }
`;
document.head.appendChild(style);

renderBoard();
