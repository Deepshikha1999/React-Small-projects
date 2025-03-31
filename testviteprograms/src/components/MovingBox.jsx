import { useEffect, useMemo, useState } from "react"

export default function MovingBox({ }) {
    const [pos, setPos] = useState({
        x: 0,
        y: 0,
        height: 100,
        width: 100
    })
    const [isSelected, setIsSelected] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const [isResizing, setIsResizing] = useState(false)

    const corners = useMemo(() => {
        return [
            {
                x: pos.x - 10,
                y: pos.y - 10
            },
            {
                x: pos.x + pos.width + 5,
                y: pos.y - 10
            },
            {
                x: pos.x + pos.width + 5,
                y: pos.y + pos.height + 5
            },
            {
                x: pos.x - 10,
                y: pos.y + pos.height + 5
            }
        ]
    }, [pos])

    function StartDrag(e) {
        if (!isSelected) return

        setOffset({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });

        setIsMoving(true)
    }

    function Drag(e) {
        if (!isSelected) return
        if (!isMoving) return

        setPos((oldPos) => ({
            ...oldPos,
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        }));
    }

    function StopDrag(e) {
        if (!isSelected) return
        setIsMoving(false)
    }

    function StartResizing(e) {
        if (!isSelected) return
        e.stopPropagation();
        setIsResizing(true)
        setIsMoving(false)
    }
    function StopResizing(e) {
        setIsResizing(false)
    }

    function Resizing(e) {
        if (!isSelected || !isResizing) return
        setPos((prevPos)=>{
            let newPos = {...prevPos}
            let [distX,distY] = [
                Math.abs(e.clientX-newPos.x),
                Math.abs(e.clientY-newPos.y)
            ]
            if(newPos.x>=e.clientX){
                newPos.width += distX
                newPos.x = e.clientX
            }
            else{
                newPos.width = distX
            }
            if(newPos.y<=e.clientY){
                newPos.height += distY
                newPos.y = e.clientY
            }
            else{
                newPos.height = distY
            }
            return newPos
        })
    }

    useEffect(() => {
        if (isMoving) {
            window.addEventListener("mousemove", Drag);
            window.addEventListener("mouseup", StopDrag);
        }
        if (isResizing) {
            window.addEventListener("mousemove", Resizing);
            window.addEventListener("mouseup", StopResizing);
        }

        return () => {
            window.removeEventListener("mousemove", Drag);
            window.removeEventListener("mouseup", StopDrag);
            window.removeEventListener("mousemove", Resizing);
            window.removeEventListener("mouseup", StopResizing);
        };

    }, [isSelected, isMoving,isResizing])

    return (
        <>
            {corners && isSelected && corners.map((corner, i) => {
                return <div className="Corner"
                    style={{
                        backgroundColor: "black",
                        height: "10px",
                        width: "10px",
                        top: `${corner.y}px`,
                        left: `${corner.x}px`,
                        position: "absolute"
                    }}
                    key={i}
                    onMouseDown={StartResizing}
                >

                </div>
            })}
            <div className="Box"
                style={{
                    position: "fixed",
                    top: `${pos.y}px`,
                    left: `${pos.x}px`,
                    width: `${pos.width}px`,
                    height: `${pos.height}px`,
                    backgroundColor: "crimson",
                    border: `${isSelected ? "2px black solid" : "none"}`
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsSelected((currSelected) => (!currSelected))
                }}
                onMouseDown={StartDrag}
            >
            </div>
        </>
    )
}