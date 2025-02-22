import { useEffect, useState } from 'react'
import './App.css'
import colors from './helper/colors.json';
import instructions from './helper/instructions.json'
import generateName from "./helper/RandomFileNameGenerator"
function App() {
  const [grid, setGrid] = useState(
    Array.from({ length: 101 }, () => Array.from({ length: 51 }, () => "0"))
  );

  const [count, setCount] = useState(0)
  const [fileName, setFileName] = useState(generateName())
  const [selectedColor, setSelectedColor] = useState(8)
  const [selected, setIsSelected] = useState(true)
  const [saveList, setSaveList] = useState({});

  const [isDraw, setIsDraw] = useState(false)
  const [isErase, setIsErase] = useState(false)
  const [canvasBoard, setCanvasBoard] = useState(false)
  const [selectedCanva, setSelectedCanva] = useState(null)

  useEffect(() => {
    if (count > 0) {
      localStorage.setItem("Canvas", JSON.stringify(saveList))
      setSelectedCanva(() => {
        if (Object.keys(saveList).length > 0) {
          return Object.keys(saveList)[0]
        }
        else {
          return fileName
        }
      })
    }
    setCount(oldCount=>oldCount+1)
  }, [saveList])

  useEffect(() => {
    setSaveList(() => {
      let storedCanvas = localStorage.getItem("Canvas");
      if (storedCanvas) {
        storedCanvas = JSON.parse(storedCanvas)
        setSelectedCanva(Object.keys(storedCanvas)[0]);
      } else {
        storedCanvas = {}
        setSelectedCanva(fileName);
      }
      return storedCanvas;
    })
  }, []);


  function handleSelection(index) {
    if (!selected || selectedColor != index) {
      setSelectedColor(index)
      setIsSelected(true)
    }
    else {
      setSelectedColor(8)
      setIsSelected(true)
      setIsDraw(false)
    }
  }

  function Draw(i, j) {
    if (isDraw && selectedColor && selected) {
      setGrid((oldGrid) => {
        let newGrid = [...oldGrid]
        newGrid[i][j] = selectedColor
        return newGrid
      })
    }
    else if (isErase) {
      setGrid((oldGrid) => {
        let newGrid = [...oldGrid]
        newGrid[i][j] = 0
        return newGrid
      })
    }
  }
  function setDraw(event) {
    if (event.key == "d") {
      setIsDraw(true)
      setIsErase(false)
    }
    if (event.key == "u") {
      setIsDraw(false)
    }
    if (event.key == "e") {
      setIsErase(true)
      setIsDraw(false)
    }
    if (event.key == "n") {
      setIsErase(false)
    }
  }

  function setDrawOrg(event) {
    setIsDraw(oldVal => !oldVal)
    setIsErase(false)
  }

  function eraseOrg(event) {
    event.preventDefault()
    setIsErase(oldVal => !oldVal)
    setIsDraw(false)
  }
  useEffect(() => {
    window.addEventListener("keydown", setDraw)
    window.addEventListener("dblclick", setDrawOrg)
    window.addEventListener("contextmenu", eraseOrg)
    return () => {
      window.removeEventListener("keydown", setDraw)
      window.removeEventListener("dblclick", setDrawOrg)
      window.removeEventListener("contextmenu", eraseOrg)
    }
  }, [])

  return (
    <>
      {!canvasBoard && <div className='Main'>
        <div className="sections">
          <div className="headingintro">
            <div className='heading'>DOODLE CANVA</div>
            <div className="newCanva" onClick={() => {
              setCanvasBoard(true)
              setFileName(generateName())
              setGrid(Array.from({ length: 101 }, () => Array.from({ length: 51 }, () => "0")))
            }}>NEW CANVA</div>
          </div>
          {Object.keys(saveList).length > 0 && <>
            <div className='canva'>{saveList[selectedCanva].map((row, i) => (
              <div className='row' key={i}>
                {row.map((box, j) => (
                  <div className="box" key={i + "_" + j} style={{
                    backgroundColor: `${colors[box]}`
                  }}></div>
                ))}
              </div>
            ))}</div>
            <div className='album'>
              {Object.keys(saveList).map((canva, ind) => {
                return <div className="photo" key={ind} onClick={() => {
                  setSelectedCanva(canva)
                }}>{
                    saveList[canva].map((row, i) => (
                      <div className='row' key={i}>
                        {row.map((box, j) => (
                          <div className="box" key={i + "_" + j} style={{
                            backgroundColor: `${colors[box]}`
                          }}></div>
                        ))}
                      </div>
                    ))
                  }</div>
              })}
              <div className="miniMenu">
                <div className="m" onClick={() => {
                  setSaveList((oldList) => {
                    let newList = { ...oldList };
                    delete newList[selectedCanva];
                    setSelectedCanva(Object.keys(newList).length > 0 ? Object.keys(newList)[0] : fileName);
                    return newList;
                  });

                }}>DELETE</div>
                <div className="m" onClick={() => {
                  setCanvasBoard(true)
                  setGrid(saveList[selectedCanva])
                  setFileName(selectedCanva)
                }}>EDIT</div>
              </div>
            </div>
          </>}
        </div>
      </div>}
      {canvasBoard && <div className='App'>
        <div className="instructions">
          <div className='intro'><h1>{instructions.Intro}</h1></div>
          <div className='steps'>
            {
              Object.keys(instructions.InstructionsToDraw).map((step, i) => {
                return <div className='line' key={i}>
                  {step} : {instructions.InstructionsToDraw[step]}
                </div>
              })
            }
          </div>
        </div>
        <div className='optionMenu'>
          <div className='menuList' onClick={() => {
            setGrid(Array.from({ length: 101 }, () => Array.from({ length: 51 }, () => "0")))
            setSelectedColor(8)
            setIsSelected(true)
            setIsDraw(false)
          }}>CLEAR</div>

          <div className='menuList' onClick={() => {
            setSelectedColor(8)
            setIsSelected(true)
            setIsDraw(false)
          }}>DEFAULT COLOR</div>

          <div className='menuList' onClick={() => {
            setGrid((oldGrid) => {
              let newGrid = [...oldGrid]
              for (let i = 0; i < oldGrid.length; i++) {
                for (let j = 0; j < oldGrid[0].length; j++) {
                  newGrid[i][j] = selectedColor
                }
              }
              return newGrid;
            })
          }}>FILL BACKGROUND</div>

          <div className="menuList" style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "2px",
            height: "100%",
          }}>
            <div className='subMenuList' style={{
              backgroundColor: `${selected ? colors[selectedColor] : "blanchedalmond"}`,
              color: `${selected ? "white" : "black"}`
            }}>PENCIL</div>

            <div className='subMenuList' style={{
              backgroundColor: `${isErase ? "black" : "blanchedalmond"}`,
              color: `${isErase ? "white" : "black"}`
            }}>ERASER</div>
          </div>

          <div className='menuList' onClick={() => {
            setSaveList(oldList => ({ ...oldList, [fileName]: grid }))
          }}>
            SAVE
          </div>

          <div className='menuList' onClick={() => {
            setCanvasBoard(false)
          }}>
            SAVED CANVAS
          </div>

        </div>
        <div className="grid">
          {grid.map((row, i) => (
            <div className='row' key={i}>
              {row.map((box, j) => (
                <div className="box" key={i + "_" + j} style={{
                  backgroundColor: `${colors[box]}`
                }} onMouseOver={() => { Draw(i, j) }}></div>
              ))}
            </div>
          ))}
        </div>
        <div className="colorGroup">
          {
            Object.values(colors).map((color, i) => (
              <div className="colorbox" key={i} style={{
                backgroundColor: `${color}`,
              }} onClick={() => { handleSelection(i) }}></div>
            ))
          }
        </div>
      </div>}
    </>
  );
}

export default App;
