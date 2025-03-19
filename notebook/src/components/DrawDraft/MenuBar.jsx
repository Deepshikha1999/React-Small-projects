import { useState } from "react";
import { FaCaretUp, FaCircleNotch, FaCopy, FaCut, FaDrawPolygon, FaEraser, FaFill, FaFillDrip, FaPaste, FaPen, FaPenSquare, FaRuler, FaSave, FaShapes, FaSquare } from "react-icons/fa";

export default function MenuBar({ toolStatus, setToolStatus }) {
    const shapes = ["none","circle", "rectangle", "line", "curve"]
    const [changeWidth, setWidth] = useState(false);

    function handleChangeWidth(event) {
        setToolStatus((currStatus) => {
            let newStatus = { ...currStatus }
            let newStrokeWidth = {}
            newStrokeWidth.width = event?.target?.value ? event.target.value : 0;
            newStatus.StrokeWidth = newStrokeWidth
            return newStatus
        })
    }

    function handleChangeFillColor(event) {
        setToolStatus((currStatus) => {
            let newStatus = { ...currStatus }
            let newFill = {}
            newFill.color = event?.target?.value ? event.target.value : "#FFFFFF";
            newStatus.Fill = newFill
            return newStatus
        })
    }

    function handleChangeStrokeColor(event) {
        setToolStatus((currStatus) => {
            let newStatus = { ...currStatus }
            let newStrokeColor = {}
            newStrokeColor.color = event?.target?.value ? event.target.value : "#000000";
            newStatus.StrokeColor = newStrokeColor
            return newStatus
        })
    }

    function HandleShapeChange(event) {
        console.log(event.target.value)
        setToolStatus((currStatus) => {
            let newStatus = { ...currStatus }
            let newShapes = {}
            newShapes.type = event?.target?.value ? event.target.value : shapes[0];
            newStatus.Shapes = newShapes
            return newStatus
        })
    }

    return (
        <div className="Menu" style={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            gap: "1px"
        }}>
            <li><FaSave className="Icon" /></li>
            <li><FaPaste className="Icon" /></li>
            <li><FaCut className="Icon" /></li>
            <li><FaCopy className="Icon" /></li>
            <li onDoubleClick={() => (setWidth(true))}>
                {
                    changeWidth ?
                        <>
                            <input type="text" defaultValue={toolStatus?.StrokeWidth?.width ? toolStatus.StrokeWidth.width : 2} onChange={handleChangeWidth} style={{ width: "50%" }} />
                            <button onClick={() => (setWidth(false))}><FaPen /></button>
                        </> :
                        <FaPen className="Icon" />
                }
            </li>
            <li><FaEraser className="Icon" /></li>
            <li><input type="color" defaultValue={toolStatus.Fill.color} onChange={handleChangeFillColor} /> <FaFillDrip className="Icon" /></li>
            <li><input type="color" defaultValue={toolStatus.StrokeColor.color} onChange={handleChangeStrokeColor} /> <FaPenSquare className="Icon" /></li>
            <li>
                <select id="tool-select" value={toolStatus?.Shapes?.type || shapes[0]} onChange={HandleShapeChange}>
                    {shapes.map((shape) => {
                        return <option key={shape} value={shape}>
                            {shape.toUpperCase()}
                        </option>
                    })}
                </select>
                {/* <FaShapes className="Icon" /> */}
            </li>
            {/* <li><FaCircleNotch className="Icon" /></li>
            <li><FaDrawPolygon className="Icon" /></li> */}
        </div>
    )
}