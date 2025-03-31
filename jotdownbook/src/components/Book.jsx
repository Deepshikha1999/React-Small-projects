import React, { useEffect, useLayoutEffect, useState } from "react";
import MenuBar from "./MenuBar";
import TextBox from "./Tools/TextBox";
const TOOLS = [
    "text", "image", "table"
]
export default function Book({ filename,setBooks,id,book }) {
    const [tools, setTools] = useState(null)
    const [components, setComponents] = useState(book)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const TOOL_FUNC_MAP = {
        "text": <TextBox pos={{x:0,y:0}} setComponents={setComponents}/>
    }

    useEffect(()=>{
        setBooks((currBooks)=>{
            let newBooks = [...currBooks]
            newBooks[id][1] = [...components]
            return newBooks
        })
    },[components])

    useEffect(() => {
        if (tools && TOOL_FUNC_MAP[tools]) {
            setComponents((curr_comp)=>{
                let new_Comp = [...curr_comp]
                let element = TOOL_FUNC_MAP[tools]
                let pos = cursorPos
                new_Comp.push(React.cloneElement(element,{pos}))
                setTools(null)
                return new_Comp
            })
        }
    }, [tools])

    function GetCursorMovement(e) {
        setCursorPos({
            x: e.clientX,
            y: e.clientY
        })
    }
    useEffect(() => {
        window.addEventListener("mousemove", GetCursorMovement)
        return () => { window.removeEventListener("mousemove", GetCursorMovement) }
    }, [])
    return (
        <div className="Book">
            <MenuBar setTools={setTools} />
            {components.map((component,i)=>{
                return component
            })}
        </div>
    )
}