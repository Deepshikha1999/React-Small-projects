import { useState } from "react"
import BlankPage from "./BlankPage"
import "./Drawing.css"
import MenuBar from "./MenuBar"

export default function Page({ }) {
    const [drawingComponents, setDrawingComponents] = useState([])
    const [toolStatus, setToolStatus] = useState({
        isPencil: {
            "status": true,
            "coords": [],
            "strokeLength": 2,
            "strokeColor": "black"
        },
        isEraser: {
            "status": false, //both pencil and eraser cannot be colored
            "coords": [],
            "strokeLength": 2 // delete the coord from pencil coords
        },
        Fill: {
            color: "#FFFFFF"
        },
        StrokeColor: {
            color: "#000000"
        },
        StrokeWidth: {
            width: 2
        },
        Shapes:{
            type: "none"
        }
    })
    return (
        <div className="DrawingPage">
            <MenuBar toolStatus={toolStatus} setToolStatus={setToolStatus} />
            <BlankPage toolStatus={toolStatus} setToolStatus={setToolStatus} drawingComponents={drawingComponents} setDrawingComponents={setDrawingComponents} />
        </div>
    )
}