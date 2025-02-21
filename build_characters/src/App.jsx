import { useEffect, useState } from 'react'
import './App.css'
import colors from './helper/colors.json';
import instructions from './helper/instructions.json'

function App() {
  const [grid, setGrid] = useState(
    Array.from({ length: 101 }, () => Array.from({ length: 51 }, () => "0"))
  );

  const [selectedColor, setSelectedColor] = useState(null)
  const [selected, setIsSelected] = useState(false)

  const [isDraw, setIsDraw] = useState(false)
  const [isErase, setIsErase] = useState(false)

  function handleSelection(index) {
    if (!selected || selectedColor != index) {
      setSelectedColor(index)
      setIsSelected(true)
    }
    else {
      setSelectedColor(null)
      setIsSelected(false)
      setIsDraw(false)
    }
  }

  function Draw(i,j){
    if(isDraw && selectedColor && selected){
      setGrid((oldGrid)=>{
        let newGrid = [...oldGrid]
        newGrid[i][j] = selectedColor
        return newGrid
      })
    }
    else if(isErase){
      setGrid((oldGrid)=>{
        let newGrid = [...oldGrid]
        newGrid[i][j] = 0
        return newGrid
      })
    }
  }
  function setDraw(event) {
    if(event.key == "d"){
      setIsDraw(true)
    }
    if(event.key == "u"){
      setIsDraw(false)
    }
    if(event.key == "e"){
      setIsErase(true)
      setIsDraw(false)
    }
    if(event.key == "n"){
      setIsErase(false)
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", setDraw)
    return () => {
      window.removeEventListener("keydown", setDraw)
    }
  }, [])

  return (
    <div className='App'>
      <div className="instructions">
          <div className='intro'><h1>{instructions.Intro}</h1></div>
          <div className='steps'>
            {
              Object.keys(instructions.InstructionsToDraw).map((step,i)=>{
                return <div className='line'>
                  {step} : {instructions.InstructionsToDraw[step]}
                </div>
              })
            }
          </div>
      </div>
      <div className='optionMenu'>
        <div className='menuList' onClick={() => {
          setGrid(Array.from({ length: 101 }, () => Array.from({ length: 51 }, () => "0")))
          setSelectedColor(null)
          setIsSelected(false)
          setIsDraw(false)
        }}>CLEAR</div>

        <div className='menuList' onClick={() => {
          setSelectedColor(null)
          setIsSelected(false)
          setIsDraw(false)
        }}>UNSELECT COLOR</div>

        <div className='menuList' style={{
          backgroundColor: `${selected ? colors[selectedColor] : "blanchedalmond"}`,
          color:`${selected?"white":"black"}`
        }}>PENCIL</div>

        <div className='menuList' style={{
          backgroundColor:`${isErase?"black":"blanchedalmond"}`,
          color:`${isErase?"white":"black"}`
        }}>ERASER</div>

      </div>
      <div className="grid">
        {grid.map((row, i) => (
          <div className='row' key={i}>
            {row.map((box, j) => (
              <div className="box" key={i + "_" + j} style={{
                backgroundColor: `${colors[box]}`
              }} onMouseOver={()=>{Draw(i,j)}}></div>
            ))}
          </div>
        ))}
      </div>
      <div className="colorGroup">
        {
          Object.values(colors).map((color, i) => (
            <div className="colorbox" key={i} style={{
              backgroundColor: `${color}`,
              // border: `${selected?"2px black solid":"none"}`,
            }} onClick={() => { handleSelection(i) }}></div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
