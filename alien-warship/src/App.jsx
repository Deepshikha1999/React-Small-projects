import { useState } from 'react'
import './App.css'
import GameGrid from './components/GameGrid'

function App() {
  const [gameStart, setGameStart] = useState(false)
  const [highestScore, setHighestScore] = useState(0)
  console.log(gameStart)
  return (
    <div className="App">
      {gameStart && <GameGrid setHighestScore={setHighestScore} setGameStart={setGameStart}/>}
      {!gameStart && <div className='StartPage'>
          <h1>Welcome To Space War</h1>
          <button onClick={()=>{
            setGameStart(true)
          }}>START</button>
          {highestScore>0 && <p>HIGHEST SCORE: {highestScore}</p>}
          <p>KEYS TO USE</p>
          <div className="Keys">
            <div className='LeftKey'>MOVE LEFT : {"LEFT ARROW"}</div>
            <div className='SpaceKey'>SHOOT : {"SPACE BAR"}</div>
            <div className='RightKey'>MOVE RIGHT : {"RIGHT ARROW"}</div>
          </div>
      </div>}
    </div>
  )
}

export default App
