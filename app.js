const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Chess Game",
  });
});

const checkPlayers = () => {
  return players.white && players.black;
};

io.on("connection", (socket) => {
  console.log("Connected");

  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  } else {
    socket.emit("spectatorRole");
  }

  io.emit("checkPlayers", checkPlayers());

  socket.on("disconnect", function () {
    if (socket.id === players.white) {
      delete players.white;
      io.emit("playerDisconnected", { player: "White", result: "Black wins!" });
    } else if (socket.id === players.black) {
      delete players.black;
      io.emit("playerDisconnected", { player: "Black", result: "White wins!" });
    }
    io.emit("checkPlayers", checkPlayers());
  });

  socket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && socket.id !== players.white) return;
      if (chess.turn() === "b" && socket.id !== players.black) return;

      const result = chess.move(move);
      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());

        if (chess.isCheckmate()) {
          io.emit(
            "gameOver",
            `${chess.turn() === "w" ? "Black" : "White"} wins by checkmate`
          );
        } else if (chess.isStalemate()) {
          io.emit("gameOver", "Draw by stalemate");
        } else if (chess.isDraw()) {
          io.emit("gameOver", "Draw");
        }
      } else {
        console.log("Invalid move : ", move);
        socket.emit("invalidMove", move);
      }
    } catch (error) {
      console.error("Some error occurred: ", error);
      socket.emit("invalidMove", move);
    }
  });

  socket.on("restartGame", () => {
    chess.reset(); 
    io.emit("boardState", chess.fen());
    io.emit("checkPlayers", checkPlayers()); 
  });
});

server.listen(3000, () => console.log("Server started on port 3000"));
