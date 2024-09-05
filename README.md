# Real-time Multiplayer Chess Game

This is a real-time multiplayer chess game built using Node.js, Socket.IO, and Chess.js. The game allows two players to connect and play against each other, while any additional users become spectators. It also handles game-over conditions like checkmate, stalemate, and draw, and displays appropriate messages. 

## Features

- Real-time multiplayer chess game.
- Two-player support (white and black).
- Spectator mode for users who join after both player slots are filled.
- Pop-up alerts for checkmate, stalemate, or draw.
- Automatic restart option after the game ends.
- Drag-and-drop interface for moving chess pieces.
- Board flips for the black player to simulate their perspective.
- If a player disconnects, the other player wins by default.
- Displays a waiting message if only one player is connected.
  
## Tech Stack

- **Frontend:** HTML, CSS (Tailwind), JavaScript.
- **Backend:** Node.js, Socket.IO.
- **Logic:** Chess.js for handling chess rules and validation.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yashbhardwaj11/chess-game-soket.io
    cd chess-game-soket.io
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the server:

    ```bash
    node app.js
    ```

4. Open your browser and go to `http://localhost:3000`.

## Game Rules

- The game follows standard chess rules.
- Only two players can play at a time; additional users will become spectators.
- When both players are connected, the game begins.
- If one player disconnects, the remaining player wins by default.
- The game automatically resets after a player wins or if the game is drawn.

## How It Works

- **Player Assignment:** The first two users to connect are assigned the roles of white and black, respectively. Any additional users become spectators.
- **Drag-and-Drop Moves:** Players can drag and drop their pieces to make moves. The board is updated in real-time for both players and spectators.
- **Game Over Conditions:** When checkmate, stalemate, or draw conditions are met, a pop-up will appear to notify the players of the game outcome. An option to restart the game will be provided.

## Socket.IO Events

### Server-side Events

- `playerRole`: Sent to players when they are assigned the white or black role.
- `spectatorRole`: Sent to users who join after the player slots are filled.
- `boardState`: Sent to update the board state across all clients.
- `move`: Sent to all clients when a valid move is made.
- `gameOver`: Sent when the game ends, notifying the winner or if the game was a draw.

### Client-side Events

- `move`: Triggered when a player makes a move, sending it to the server for validation.
- `restartGame`: Sent to the server to reset the game after it ends.

## File Structure

├── public 
  │└── css  
    │ └── styles.css 
# Contains styles for the game 
├── views 
  │ └── index.ejs 
# Main game UI 
├── app.js 
# Server-side code and Socket.IO logic 
├── package.json 
# Project dependencies 
├── .gitignore # Ignore node_modules 
└── README.md # Project documentation

## Known Issues

- The game doesn't support pawn promotion beyond promoting to a queen automatically.
- No timer for moves.
  
## Future Enhancements

- Implement customizable pawn promotion.
- Add a timer for each player's turn.
- Implement chat for players and spectators.
