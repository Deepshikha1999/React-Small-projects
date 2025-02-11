import { useState } from 'react';
const gridLength = 200
export default function Pixels() {
    const [grid, setGridColor] = useState(Array.from({ length: gridLength }, () => Array(gridLength).fill(false)));
    // const [isDrawing, setIsDrawing] = useState(false);

    // const startDrawing = () => setIsDrawing(true);
    // const stopDrawing = () => setIsDrawing(false);
    const arr = new Array(gridLength).fill(0);
    function changeColour(index1, index2) {
        setGridColor((curr_Grid) => curr_Grid.map((row, i) =>

            row.map((col, j) => ((i === index1 && j === index2) || (i === index1+1 && j === index2) || (i === index1 && j === index2+1) || (i === index1+1 && j === index2+1)
            || (i === index1-1 && j === index2) || (i === index1 && j === index2-1) || (i === index1-1 && j === index2-1) ? true : col))))

    }
    return <div className="board">
        {arr.map((item1, index1) =>
            <div key={"row" + index1}>
                {arr.map((item, index) => <div className={grid[index1][index] ? "pixel-active" : "pixel"} key={"col" + index} onMouseEnter={() => changeColour(index1, index)} onMouseDown={() => changeColour(index1, index)}>
                </div>)}
            </div>)}
    </div>
}

