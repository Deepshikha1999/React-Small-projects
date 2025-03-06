import { useState } from 'react'
import './App.css'
import PlayGround from './components/PlayGround'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className = "App">
        <PlayGround/>
      </div>
  )
}

export default App
