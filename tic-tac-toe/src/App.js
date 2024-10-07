import Player from "./Components/Player";
import GameBoard from "./Components/GameBoard";
import Log from "./Components/Log";
import { useState } from "react";
import GameOver from "./Components/GameOver";
const initialGameboard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]];
const playerComponent = {
  'X': 'Player1',
  'O': 'Player2'
};
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player == 'X') {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function computeBoardResult(gameboard, x, y) {
  //check row
  if (gameboard[x].join("") == "XXX" || gameboard[x].join("") == "OOO")
    return true;

  // check column
  let s = gameboard[0][y] + gameboard[1][y] + gameboard[2][y];
  if (s == "XXX" || s == "OOO")
    return true;

  //check left diagonal
  if (x == y) {
    s = gameboard[0][0] + gameboard[1][1] + gameboard[2][2];
    if (s == "XXX" || s == "OOO")
      return true;
  }
  //check right diagonal
  if ((x + y) == 2) {
    s = gameboard[0][2] + gameboard[1][1] + gameboard[2][0];
    if (s == "XXX" || s == "OOO")
      return true;
  }
}

function deriveGameboard(gameTurns) {
  let gameboard = [...initialGameboard.map(array => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, column } = square;

    gameboard[row][column] = player;
  }
  return gameboard;
}

function App() {
  const [players, setPlayers] = useState(playerComponent);
  const [gameTurns, setGameTurns] = useState([]);
  // const [activePlayer, setActivePlayer] = useState('X');
  let winner;
  let currentPlayer = deriveActivePlayer(gameTurns);
  let gameboard = deriveGameboard(gameTurns);
  if (gameTurns.length != 0 && computeBoardResult(gameboard, gameTurns[0].square.row, gameTurns[0].square.column)) {
    winner = players[gameTurns[0].player];
  }
  let drawMatch = gameTurns.length == 9 && !winner;
  function handleSelectSquare(rowIndex, columnIndex) {
    // setActivePlayer((curActivePlayer) => curActivePlayer === "X" ? "O" : "X");
    setGameTurns(prevTurns => {
      let currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, column: columnIndex }, player: currentPlayer },
        ...prevTurns];

      return updatedTurns;
    });
  }
  function handleRestart() {
    setGameTurns([]);
  }

  function hanldePlayerNameChange(symbol, newName) {
    setPlayers((players) => {
      return {
        ...players,
        [symbol]: newName
      }
    })
  }
  return <main>
    <div id="game-container">
      <ol id="players">
        <Player initialName={players['X']} symbol="X" isActive={currentPlayer === "X"} onChangeName={hanldePlayerNameChange} />
        <Player initialName={players['O']} symbol="O" isActive={currentPlayer === "O"} onChangeName={hanldePlayerNameChange} />
      </ol>
      {winner || drawMatch ? <GameOver winner={winner} onRestart={handleRestart} /> : null}
      <GameBoard onSelectSquare={handleSelectSquare} gameboard={gameboard} />
    </div>
    <Log turns={gameTurns} />
  </main>
}

export default App;