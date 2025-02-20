import { useEffect, useState } from "react";
import generateMaze from "../helper/MazeGenerator";

export default function Grid({X,Y,setLevels,setStartGame}) {
    // const VIEW_X = X;
    // const VIEW_Y = Y;
    const [[VIEW_X,VIEW_Y],setViews] = useState([X,Y])
    const [jump, setJump] = useState(1)
    const [viewPos, setViewPos] = useState({ x: 0, y: 0 })
    const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 })
    // const [grid, setGrid] = useState(Array.from({ length: X }, (_, i) => {
    //     return Array.from({ length: Y }, (_, j) => {
    //         return {
    //             x: i,
    //             y: j,
    //             setPlayer: false
    //         }
    //     })
    // }))

    const [grid, setGrid] = useState(generateMaze(X, Y))
    useEffect(() => {
        setGrid((oldGrid) =>
            oldGrid.map((row, i) =>
                row.map((cell, j) => ({
                    ...cell,
                    setPlayer: i === playerPos.x && j === playerPos.y,
                }))
            )
        );
    
        if(grid[playerPos.x][playerPos.y].exit){
            setLevels((oldLevel)=>(oldLevel+1))
            setStartGame(false)
        }
    }, [playerPos])

    function handleKeyDown(event) {
        setPlayerPos((oldPos) => {
            let newX = oldPos.x;
            let newY = oldPos.y;

            if (event.key === "w" || event.key === "ArrowUp") {
                newX = Math.max(oldPos.x - jump, 0);
            }
            else if (event.key === "s" || event.key === "ArrowDown") {
                newX = Math.min(oldPos.x + jump, X - 1);
            }
            else if (event.key === "d" || event.key === "ArrowRight") {
                newY = Math.min(oldPos.y + jump, Y - 1);
            }
            else if (event.key === "a" || event.key === "ArrowLeft") {
                newY = Math.max(oldPos.y - jump, 0);
            }
            else if (event.key === " ") {
                setJump(5);
                return oldPos;
            }

            // setViewPos(oldView => ({
            //     x: Math.min(Math.max(newX - Math.floor(VIEW_X / 2), 0), X - VIEW_X),
            //     y: Math.min(Math.max(newY - Math.floor(VIEW_Y / 2), 0), Y - VIEW_Y)
            // }));

            return grid[newX][newY].wall ? oldPos : { x: newX, y: newY };
        });
    }

    function handleKeyUp(event) {
        if (event.key == " ") {
            setJump(1)
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    })

    // console.log(viewPos)
    return (
        <div className="Grid" style={{
            gridTemplateRows: `repeat(${VIEW_X}, 1fr)`,
            gap: "0",
        }}>
            {grid.slice(viewPos.x, viewPos.x + VIEW_X).map((row, i) => (
                <div key={i + viewPos.x} className="Row" style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${VIEW_Y}, 1fr)`,
                    gap: "0",
                }}>
                    {row.slice(viewPos.y, viewPos.y + VIEW_Y).map((col, j) => (
                        <div className="Box" key={`${i + viewPos.x}-${j + viewPos.y}`}>
                            {col.setPlayer && <Player>{`${i + viewPos.x}-${j + viewPos.y}`}</Player>}
                            {col.wall && <div className="Wall" />}
                            {col.exit && <div className="Exit" />}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
