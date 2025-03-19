import { useEffect, useMemo, useRef, useState } from "react"
import { FaCircle, FaDrawPolygon, FaEllipsisH, FaEraser, FaFill, FaFillDrip, FaLine, FaPen, FaPenFancy, FaPenNib, FaPencilAlt, FaSquare } from "react-icons/fa"
import Rectangle from "./Shapes/Rectangle"
import Circle from "./Shapes/Circle"

export default function DrawingPage({ }) {

    const options = ["Circle", "Rectangle", "Line", "Polygon", "Strokes Width", "Stroke Color", "Fill Color", "Fill Color Icon", "Fill Line Color","Eraser"]
    const [shapes, setShapes] = useState([])
    const [curr_shape_pos, set_curr_shape_pos] = useState(null)
    const drawingPageRef = useRef(null)
    const dragging = useRef(false)
    const resizing = useRef(false)
    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeDirection = useRef(null);
    const EDGE_THRESHOLD = 10;
    const [strokeSWidth, setStokeWidth] = useState(2)
    const [recentColors, setRecentColors] = useState(new Set())
    const [backGroundColor, setBackGroundColors] = useState("white")
    const [strokeColor, setStrokeColors] = useState("black")
    const [defaultTool, setDefaultTool] = useState("Pencil")
    const [copyIndex, setCopyIndex] = useState(-1)
    const [cutIndex, setCutIndex] = useState(-1)
    const [lines, setLines] = useState([])
    const [isDraw, setIsDraw] = useState(true)
    const [polyLines, setPolyLines] = useState([])

    function StartDragOrResize(event) {
        setIsDraw(false)
        event.stopPropagation();
        const { offsetX, offsetY } = event.nativeEvent;
        const { x, y, width, height } = shapes[curr_shape_pos];
        const nearLeft = Math.abs(offsetX - x) < EDGE_THRESHOLD;
        const nearRight = Math.abs(offsetX - (x + width)) < EDGE_THRESHOLD;
        const nearTop = Math.abs(offsetY - y) < EDGE_THRESHOLD;
        const nearBottom = Math.abs(offsetY - (y + height)) < EDGE_THRESHOLD;
        if (nearLeft || nearRight || nearTop || nearBottom) {
            resizing.current = true;
            resizeDirection.current = { left: nearLeft, right: nearRight, top: nearTop, bottom: nearBottom };
        } else {
            dragging.current = true;
            dragOffset.current = { x: offsetX - x, y: offsetY - y };
        }
        dragOffset.current = {
            x: event.nativeEvent.offsetX - shapes[curr_shape_pos].x,
            y: event.nativeEvent.offsetY - shapes[curr_shape_pos].y,
        };
    }

    function StopDragOrResize(event) {
        dragging.current = false
        resizing.current = false
        resizeDirection.current = null;
        setIsDraw(true)
    }

    function DragOrResizeTheObject(event) {
        if (dragging.current) {
            setShapes(oldShapes => {
                let newShapes = [...oldShapes]
                newShapes[curr_shape_pos] = {
                    ...newShapes[curr_shape_pos],
                    x: event.nativeEvent.offsetX - dragOffset.current.x,
                    y: event.nativeEvent.offsetY - dragOffset.current.y,
                }
                return newShapes
            });
        }
        if (resizing.current && resizeDirection.current) {
            const { offsetX, offsetY } = event.nativeEvent;
            setShapes((oldShapes) => {
                let newShapes = [...oldShapes]
                let prev = newShapes[curr_shape_pos]
                if (prev.shape == "Rectangle") {
                    let newX = prev.x;
                    let newY = prev.y;
                    let newWidth = prev.width;
                    let newHeight = prev.height;

                    if (resizeDirection.current.right) {
                        newWidth = Math.max(20, offsetX - prev.x); // Prevent negative width
                    }
                    if (resizeDirection.current.bottom) {
                        newHeight = Math.max(20, offsetY - prev.y); // Prevent negative height
                    }
                    if (resizeDirection.current.left) {
                        const diff = prev.x - offsetX;
                        newWidth = Math.max(20, prev.width + diff);
                        newX = prev.x - (newWidth - prev.width);
                    }
                    if (resizeDirection.current.top) {
                        const diff = prev.y - offsetY;
                        newHeight = Math.max(20, prev.height + diff);
                        newY = prev.y - (newHeight - prev.height);
                    }
                    newShapes[curr_shape_pos] = { ...newShapes[curr_shape_pos], x: newX, y: newY, width: newWidth, height: newHeight }
                }
                if (prev.shape == "Circle") {
                    let newX = prev.x;
                    let newY = prev.y;
                    let newRadius = prev.radius;

                    if (resizeDirection.current.right) {
                        newRadius = Math.max(5, offsetX - prev.x); // Prevent negative width
                    }
                    if (resizeDirection.current.bottom) {
                        newRadius = Math.max(5, offsetY - prev.y); // Prevent negative height
                    }
                    if (resizeDirection.current.left) {
                        const diff = prev.x - offsetX;
                        newRadius = Math.max(5, prev.radius + diff);
                        newX = prev.x - (newRadius - prev.radius);
                    }
                    if (resizeDirection.current.top) {
                        const diff = prev.y - offsetY;
                        newRadius = Math.max(5, prev.radius + diff);
                        newY = prev.y - (newRadius - prev.radius);
                    }
                    newShapes[curr_shape_pos] = { ...newShapes[curr_shape_pos], x: newX, y: newY, radius: newRadius }
                }
                return newShapes;
            });
        }
    }

    function createRectangle(event) {
        setShapes((oldShapes) => {
            let new_Shapes = [...oldShapes, { x: 50, y: 50, width: 50, height: 50, strokeSWidth: strokeSWidth, strokeColor: strokeColor, fillColor: backGroundColor, shape: "Rectangle" }]
            set_curr_shape_pos(new_Shapes.length - 1)
            return new_Shapes;
        })
    }

    function createCircle(event) {
        setShapes((oldShapes) => {
            let new_Shapes = [...oldShapes, { x: 50, y: 50, radius: 50, strokeSWidth: strokeSWidth, strokeColor: strokeColor, fillColor: backGroundColor, shape: "Circle" }]
            set_curr_shape_pos(new_Shapes.length - 1)
            return new_Shapes;
        })
    }

    function changeStokes(event) {
        setStokeWidth(event.target.value);
    }

    useEffect(() => {
        const pasteHandle = (e) => {
            if (cutHandle > -1) {
                setShapes((curr_shapes) => {
                    let newShapes = [...curr_shapes];
                    newShapes.push({
                        ...curr_shapes[cutIndex],
                        x: curr_shapes[cutIndex].x + 10,
                        y: curr_shapes[cutIndex].y + 10,
                    });
                    newShapes.splice(cutIndex, 1);
                    set_curr_shape_pos(newShapes.length - 1);
                    return newShapes;
                });
            }
            else if (copyIndex > -1) {
                setShapes((curr_shapes) => {
                    let newShapes = [...curr_shapes];
                    newShapes.push({
                        ...curr_shapes[copyIndex], // Create a new copy of the shape
                        x: curr_shapes[copyIndex].x + 10, // Offset so it's not on top of the original
                        y: curr_shapes[copyIndex].y + 10,
                    });
                    set_curr_shape_pos(newShapes.length - 1); // Select the new shape
                    return newShapes;
                });
            }
        };

        const copyHandle = (e) => {
            if (curr_shape_pos !== null) {
                setCopyIndex(curr_shape_pos);
            }
        };

        const cutHandle = (e) => {
            if (curr_shape_pos !== null) {
                setCutIndex(curr_shape_pos);
            }
        }

        window.addEventListener("paste", pasteHandle)
        window.addEventListener("copy", copyHandle)
        window.addEventListener("cut", cutHandle)
        return () => {
            window.removeEventListener("paste", pasteHandle)
            window.removeEventListener("copy", copyHandle)
            window.removeEventListener("cut", cutHandle)
        }
    }, [copyIndex, curr_shape_pos, cutIndex])

    useEffect(() => {
        function Draw(event) {

            if (isDraw && event.buttons === 1) {
                {
                    setLines((curr_lines) => {
                        setPolyLines(curr_polylines => {
                            let new_lines = [...curr_polylines]
                            new_lines[new_lines.length - 1] = [...curr_lines, [event.offsetX, event.offsetY].join(",")]
                            return new_lines
                        })
                        return [...curr_lines, [event.offsetX, event.offsetY].join(",")]
                    })
                }
            }
        }
    
        function StartDraw(event) {
            if (isDraw && event.buttons === 1) {
                {
                    setLines((curr_lines) => {
                        setPolyLines((curr_polylines) => {
                            let new_lines = [...curr_polylines]
                            new_lines.push([[event.offsetX, event.offsetY].join(",")].join(" "))
                            return new_lines
                        })
                        return ([[event.offsetX, event.offsetY].join(",")])
                    })
                }
            }
    
        }
        window.addEventListener("mousedown", StartDraw)
        window.addEventListener("mousemove", Draw)
        return () => {
            window.removeEventListener("mousedown", StartDraw)
            window.removeEventListener("mousemove", Draw)
        }
    }, [isDraw,polyLines])

    return (
        <div className="DrawingPage">
            <div className="MenuBar" style={{
                display: "grid",
                gridTemplateColumns: `repeat(${options.length},0.5fr)`,
                placeItems: "center",
            }}>
                <div className="menuLs"><FaCircle onClick={createCircle} /></div>
                <div className="menuLs"><FaSquare onClick={createRectangle} /></div>
                <div className="menuLs"><FaPencilAlt onClick={()=>(isDraw(true))}/></div>
                <div className="menuLs"><FaEraser onClick={()=>(isDraw(false))}/></div>
                <div className="menuLs"><FaDrawPolygon /></div>
                <div className="menuLs"><input type="number" defaultValue={strokeSWidth} onChange={changeStokes} /></div>
                <div className="menuLs"><input type="color" defaultValue={strokeColor} onChange={(e) => {
                    setStrokeColors((lastColor) => {
                        setRecentColors((oldColor) => {
                            let new_sets = new Set(oldColor)
                            new_sets.add(lastColor)
                            return new_sets
                        })
                        return e.target.value
                    })
                }} style={{ cursor: "pointer", border: "none", background: "transparent" }}></input><FaPen /></div>
                <div className="menuLs"><input type="color" defaultValue={backGroundColor} onChange={(e) => {
                    setBackGroundColors((lastColor) => {
                        setRecentColors((oldColor) => {
                            let new_sets = new Set(oldColor)
                            new_sets.add(lastColor)
                            return new_sets
                        })
                        return e.target.value
                    })
                }} style={{ cursor: "pointer", border: "none", background: "transparent" }} /><FaFill /></div>

                <div className="menuLs"><FaFillDrip onClick={() => {
                    if (curr_shape_pos !== null) {
                        setShapes((curr_shapes) => {
                            let newShapes = [...curr_shapes]
                            newShapes[curr_shape_pos].fillColor = backGroundColor
                            return newShapes;
                        })
                    }
                }} /></div>

                <div className="menuLs"><FaPenFancy onClick={() => {
                    if (curr_shape_pos !== null) {
                        setShapes((curr_shapes) => {
                            let newShapes = [...curr_shapes]
                            newShapes[curr_shape_pos].strokeColor = strokeColor
                            return newShapes;
                        })
                    }
                }} /></div>
            </div>
            <div className="ColorBar">
                {Array.from(recentColors).map((color, i) => {
                    return <div className="color" key={i} style={{
                        backgroundColor: `${color}`,
                        height: "1em",
                        width: "1em"
                    }} onClick={() => {
                        setBackGroundColors(color)
                    }}></div>
                })}
            </div>
            <svg className="BlankPage"
                xmlns="http://www.w3.org/2000/svg"
                ref={drawingPageRef}
                onMouseUp={StopDragOrResize}
                onMouseMove={DragOrResizeTheObject}
                onMouseLeave={StopDragOrResize}
            // cursor = {defaultTool=="Pencil"? "":""}
            >
                {
                    shapes.map((shape, i) => {
                        if (shape.shape == "Rectangle") {
                            return <Rectangle
                                key={i}
                                shapes={shapes}
                                i={i}
                                StartDragOrResize={StartDragOrResize}
                                drawingPageRef={drawingPageRef}
                                setShapes={setShapes}
                                set_curr_shape_pos={set_curr_shape_pos}
                            />
                        }
                        if (shape.shape == "Circle") {
                            return <Circle
                                key={i}
                                shapes={shapes}
                                i={i}
                                StartDragOrResize={StartDragOrResize}
                                drawingPageRef={drawingPageRef}
                                setShapes={setShapes}
                                set_curr_shape_pos={set_curr_shape_pos}
                            />
                        }

                    })
                }
                {/* {lines.length > 1 &&
                lines.slice(1).map((line, i) => (
                    <line
                        key={i} // Ensure each line has a unique key
                        stroke={strokeColor}
                        strokeWidth={strokeSWidth}
                        x1={lines[i][0]} // Use previous point as x1, y1
                        y1={lines[i][1]}
                        x2={line[0]} // Use current point as x2, y2
                        y2={line[1]}
                    ></line>
                ))} */}
                {polyLines.map((curr_lines, i) => (<polyline
                    key={i}
                    points={curr_lines}
                    fill="none"
                    strokeWidth={strokeSWidth}
                    stroke={strokeColor}
                ></polyline>))}

            </svg>


        </div>
    )
}