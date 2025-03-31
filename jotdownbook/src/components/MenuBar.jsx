import { useEffect, useRef, useState } from "react"
import { FaImage, FaMinus, FaTable, FaTextWidth } from "react-icons/fa"

export default function MenuBar({ setTools }) {
    const [menubarPos, setMenuBarPos] = useState({
        x: 0,
        y: 0
    })

    const [showMenuBarList, setShowMenuBarList] = useState(true)

    const [moving, setMoving] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    function handleDragStart(e) {
        setMoving(true)
        setOffset({
            x: e.clientX - menubarPos.x,
            y: e.clientY - menubarPos.y,
        });
    }

    function handleDrag(e) {
        if (!moving) return
        setMenuBarPos({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    }

    function handleDragStop() {
        setMoving(false)
    }
    return (
        <div className="MenuBar"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
            onMouseMove={handleDrag}
            onMouseLeave={handleDragStop}
            style={{
                position: "fixed",
                left: menubarPos.x == 0 ? null : `${menubarPos.x}px`,
                top: menubarPos.y == 0 ? null : `${menubarPos.y}px`,
            }}
        >
            <div className="MenuList" onClick={() => {
                setShowMenuBarList((oldVal) => (!oldVal))
            }}><FaMinus /></div>
            {
                showMenuBarList && <>
                    <div className="MenuList" onClick={()=>(setTools("text"))}><FaTextWidth /></div>
                    <div className="MenuList" onClick={()=>(setTools("image"))}><FaImage /></div>
                    <div className="MenuList" onClick={()=>(setTools("table"))}><FaTable /></div>
                </>
            }

        </div>
    )
}