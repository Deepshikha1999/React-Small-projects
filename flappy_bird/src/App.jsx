import './App.css'
import FlappyBird from './components/FlappyBird'
import { useState, useEffect, useRef } from 'react'
import ResultDialog from './components/ResultDialog'

function App() {
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOverStatus, setGameOverStatus] = useState(false)
  const [message, setMessage] = useState(null)
  console.log(gameOverStatus)
  useEffect(() => {
    if (gameOverStatus && gameRef.current) {
      gameRef.current.open();
    }
  }, [gameOverStatus]); // Runs whenever `gameOverStatus` changes

  function handleReset() {
    setGameOverStatus(false);
    setScore(0);
    setMessage(null);
  }
  function handleReset() {
    setGameOverStatus(false)
  }
  return (
    <div className='App'>
      {!gameOverStatus && <FlappyBird setStatus={setGameOverStatus} setScore={setScore} setMessage={setMessage} />}
      {gameOverStatus && <ResultDialog gameOverStatus={gameOverStatus} score={score} message={message} onReset={handleReset} ref={gameRef} />}
    </div>
  )
}

export default App
