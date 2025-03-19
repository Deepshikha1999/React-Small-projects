import { useLayoutEffect } from "react";

export default function ({ shapes, i, StartDragOrResize, drawingPageRef, setShapes, set_curr_shape_pos }) {
    useLayoutEffect(() => {
        const page = drawingPageRef.current;
        if (!page) return;
        const pageInfo = page.getBoundingClientRect()
        setShapes((oldShapes => {
            let newShapes = [...oldShapes]
            newShapes[i] = {
                ...newShapes[i],
                x: pageInfo.x + 10,
                y: pageInfo.y + 10
            }
            return newShapes
        }))
    }, [])
    return <rect x={shapes[i].x}
        y={shapes[i].y}
        height={shapes[i].height}
        width={shapes[i].width}
        stroke={shapes[i].strokeColor}
        strokeWidth={shapes[i].strokeSWidth}
        fill={shapes[i].fillColor}
        draggable
        onMouseDown={StartDragOrResize}
        style={{ cursor: "grab" }}
        onClick={() => {
            set_curr_shape_pos(i)
        }}
    />
}