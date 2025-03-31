import React, { useEffect, useState } from "react"

export default function TextBox({ pos,setComponents }) {

    const [textContent, setText] = useState("")
    const [compPos, setCompPos] = useState(pos)
    const [moving, setMoving] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    useEffect(()=>{
        setComponents((curr_comp)=>{
            let new_comp = [...curr_comp]
            let pos = compPos
            let modifiedLatComp = React.cloneElement(new_comp[new_comp.length-1],pos)
            new_comp[new_comp.length-1] = modifiedLatComp
            return new_comp
        })
    },[compPos])
    function handleChange(e) {
        setText(e.target.value)
    }

    function handleDragStart(e) {
        setMoving(true)
        setOffset({
            x: e.clientX - menubarPos.x,
            y: e.clientY - menubarPos.y,
        });
    }

    function handleDrag(e) {
        if (!moving) return
        setCompPos({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    }

    function handleDragStop() {
        setMoving(false)
    }

    return (
        <div className="TextBox"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
            onMouseMove={handleDrag}
            onMouseLeave={handleDragStop}
            style={{
                position: "fixed",
                top: `${compPos.x}px`,
                left: `${compPos.y}px`
            }}>
            <textarea defaultValue={textContent} onChange={handleChange} style={{
                height: "100px",
                width: "100px"
            }} />
        </div>
    )
}