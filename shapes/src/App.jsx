import './App.css'
import { useState } from 'react';
import Circle from './components/Circle'
import FibonacciSpiral from './components/FibonacciSpiral'
import Rectangle from './components/Rectangle'
import Triangle from './components/Triangle'
const SHAPES = [<Rectangle />, <Circle />, <Triangle />]
function App() {
  const [isShape, setIsShape] = useState(false)
  function handleButton(){
    setIsShape(oldVal=>!oldVal)
  }
  return (
    <>
      <button onClick={handleButton}>
        {isShape ? <FibonacciSpiral /> : <div className="geometry">
          {SHAPES.map((item, ind) => <div className="shapes" key={ind}>{item}</div>)}
        </div>}
      </button>
    </>

  )
}

export default App
