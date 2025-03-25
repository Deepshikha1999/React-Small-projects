import { useState } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'

function App() {
  
  return (
    <div className='App'>
      <div className = "Header">

      </div>
      <div className = "Main">
        <GameBoard/>
      </div>
    </div>
  )
}

export default App