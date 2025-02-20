import { useEffect, useState } from 'react'
import './App.css'
import Grid from './components/Grid'
const LEVELS = { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25, 6: 30, 7: 35, 8: 40, 9: 45, 10: 50 }
const N = 10
function App() {

  const [level, setLevels] = useState(!localStorage.getItem("Level") ? 1 : parseInt(localStorage.getItem("Level")))
  const [gridSize, setGridSize] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [startGame, setStartGame] = useState(false)
  useEffect(() => {
    if (level <= N) {
      setGridSize({
        X: LEVELS[level],
        Y: LEVELS[level]
      })
      localStorage.setItem("Level", level + "")
    }
    else {
      setGameOver(true)
      localStorage.removeItem("Level");
    }
  }, [level])

  function StartGame() {
    if (level <= N) {
      setStartGame(true);
    } else {
      setGameOver(true);
    }
  }

  function PlayAgain() {
    const newLevel = 1; // Explicitly reset to level 1
    setLevels(newLevel);
    setStartGame(false); // Ensure the game starts fresh
    setGameOver(false);
    setGridSize({
      X: LEVELS[newLevel], // Use new level
      Y: LEVELS[newLevel]
    });
    localStorage.setItem("Level", newLevel.toString()); // Store correctly
  }

  return (
    <div className='App'>
      {!startGame && <div className="Dialog">
        {
          gameOver ? <button onClick={PlayAgain}> PLAY AGAIN </button> : (<>
            {level != 1 && <button onClick={PlayAgain}> RESTART </button>}
            <button onClick={StartGame}>{level == 1 ? "START GAME" : `LEVEL ${level}`}</button></>
          )
        }
      </div>}
      {startGame && <Grid X={gridSize.X + 1} Y={gridSize.Y + 1} setLevels={setLevels} setStartGame={setStartGame} />}
    </div>
  )
}

export default App
