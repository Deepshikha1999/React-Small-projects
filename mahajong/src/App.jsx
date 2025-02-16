import { useEffect, useRef, useState } from 'react'
import './App.css'
import Board from './components/Board'
import StartPage from './components/StartPage'
const TotalLevel = 8

const IMG_LINKS = 8

function App() {
  const [startGame, setStartGame] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0)
  const [randomImg, setRandomImg] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [heighestScore, setHighestScore] = useState(0)

  useEffect(() => {
    setRandomImg(Math.floor(Math.random() * IMG_LINKS))
  }, [currentLevel])


  function onHandleNext(nextOrPrev) {
    if (nextOrPrev === ">>") {
      if ((currentLevel + 2) > TotalLevel) {
        setGameOver(true)
      }
      else
        setCurrentLevel((oldLevel => oldLevel + 2))
    }
    else if (nextOrPrev === "<<" && (currentLevel - 2) != 0) {
      setCurrentLevel((oldLevel => oldLevel - 2))
    }
  }

  function reset() {
    if (heighestScore < score) {
      setHighestScore((oldScore) => Math.max(score, oldScore))
    }

    setStartGame(false)
    setScore(0)
    setGameOver(false)
  }
  return (
    <div className="App">

      {gameOver && <div className='Start'>
        <h1>GAME OVER</h1>
        <h3 className="score">HIGHEST SCORE: {heighestScore}</h3>
        <h2 className="score">{heighestScore < score && "NEW HIGHEST"} SCORE: {score}</h2>
        <button onClick={reset}>PLAY AGAIN</button>
      </div>}
      {
        !gameOver && <>
          {!startGame && <StartPage setGame={setStartGame} setLevel={() => setCurrentLevel(2)} />}
          {startGame && currentLevel !== 0 && <Board
            level={currentLevel}
            onHandleNextLevel={() => { onHandleNext(">>") }}
            randomImg={randomImg}
            setGameOver={setGameOver}
            TotalLevel={TotalLevel}
            setScore={setScore} />}
        </>
      }

    </div>
  )
}

export default App