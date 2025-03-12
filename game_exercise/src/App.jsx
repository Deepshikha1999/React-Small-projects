import { useEffect, useRef, useState } from 'react'
import './App.css'
import Menu from './components/Menu'
import { search_For_Artist } from './helper/server'
import Bird from "./components/Bird"


const TITLE = ["F", "I", "D", "D", "L", "E", " ", "A", "B", "O", "U", "T"]
function App() {
  const [title, setTitle] = useState(1)
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTitle((curr_title) => {
        if ((curr_title + 1) % TITLE.length > 1)
          return (curr_title + 1) % TITLE.length
        else
          return TITLE.length
      })
    }, 100)
    return () => { clearInterval(timeInterval) }
  }, [])
  return (
    <div className='App'>
      <div className='Header'> <h1>{TITLE.slice(0, title).join("")}</h1> </div>
      <Bird/>
      {/* <div className='Footer'>
        <div className="Back">{"Back"}</div>
        <div className="Home">{"Home"}</div>
      </div> */}
    </div>
  )
}

export default App
