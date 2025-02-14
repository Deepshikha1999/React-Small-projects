import './App.css'
import FlappyBird from './components/FlappyBird'
import { useState, useEffect, useRef } from 'react'
import ResultDialog from './components/ResultDialog'
import Start_Page from './components/Start_Page';

function App() {
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOverStatus, setGameOverStatus] = useState(false)
  const [message, setMessage] = useState(null)
  const [gameStart,setGameStart] = useState(false)
  // console.log(gameOverStatus)
  console.log(score)
  useEffect(() => {
    if (gameOverStatus && gameRef.current) {
      gameRef.current.open();
    }
  }, [gameOverStatus]); // Runs whenever `gameOverStatus` changes

  function handleReset() {
    setGameStart(false)
  }

  function handleStart(){
    setGameStart(true)
    setGameOverStatus(false)
    setScore(0);
    setMessage(null);
  }
  return (
    <div className='App'>
      {!gameOverStatus && <FlappyBird setStatus={setGameOverStatus} setScore={setScore} setMessage={setMessage} startGame={gameStart}/>}
      {gameOverStatus && <ResultDialog gameOverStatus={gameOverStatus} score={score} message={message} onReset={handleReset} ref={gameRef} />}
      {!gameStart && <Start_Page onStart={handleStart}/>}
    </div>
  )
}

export default App
