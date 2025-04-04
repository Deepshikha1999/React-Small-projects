import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <h1 class="text-5xl font-bold underline">
        Hello world!
      </h1>
    </div>
  )
}

export default App
 