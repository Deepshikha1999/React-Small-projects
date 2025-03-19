import { useEffect, useState } from "react"
import PolyLine from "./PolyLine"
import ComponentMapper from "../../assets/ComponentMapper.json"
import Line from "./Line"
import Rectangle from "./Rectangle"
import Circle from "./Circle"
import Curve from "./Curve"
const components = {
    "polyline": PolyLine,
    "line":Line,
    "rectangle":Rectangle,
    "circle": Circle,
    "curve": Curve
}
export default function BlankPage({ toolStatus, setToolStatus, drawingComponents, setDrawingComponents }) {

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        function StartDraw(event) {
            if (isDrawing && event.buttons === 1) {
                setDrawingComponents((currDrawingComp) => {
                    let newDrawingComponent = [...currDrawingComp]
                    let comp = { ...ComponentMapper["default"], properties: { ...ComponentMapper["default"].properties } }
                    comp.properties.fill = "none"
                    if(toolStatus.Shapes.type !== "none"){
                        comp = { ...ComponentMapper[toolStatus.Shapes.type], properties: { ...ComponentMapper[toolStatus.Shapes.type].properties } }
                        if(toolStatus.Shapes.type === "rectangle" || toolStatus.Shapes.type === "circle")
                            {
                                comp.properties.fill = toolStatus.Fill.color
                                setTimeout(() => {
                                    setIsDrawing(false);
                                }, 0);
                            }
                    }
                    
                    comp.properties.points= `${event.offsetX},${event.offsetY}`
                    comp.properties.strokeWidth= toolStatus.StrokeWidth.width
                    comp.properties.strokeColor = toolStatus.StrokeColor.color
                    newDrawingComponent.push(comp)
                    return newDrawingComponent;
                })
            }
    
        }
    
        function Draw(event) {
            if(isDrawing && event.buttons === 1){
                setDrawingComponents((currDrawingComp) => {
                    let newDrawingComponent = [...currDrawingComp];
                    let lastIndex = newDrawingComponent.length - 1;
                    if (lastIndex >= 0) {
                        newDrawingComponent[lastIndex] = {
                            ...newDrawingComponent[lastIndex],
                            properties: {
                                ...newDrawingComponent[lastIndex].properties,
                                points: `${newDrawingComponent[lastIndex].properties.points} ${event.offsetX},${event.offsetY}`
                            }
                        };
                    }
                    return newDrawingComponent;
                });
            }
        }
    
        function StopDrawing(event) {
            setIsDrawing(false)
        }
        window.addEventListener("mousedown", StartDraw)
        window.addEventListener("mousemove", Draw)
        window.addEventListener("mouseup",StopDrawing)
        return () => {
            window.removeEventListener("mousedown", StartDraw)
            window.removeEventListener("mousemove", Draw)
            window.removeEventListener("mouseup",StopDrawing)
        }

    }, [isDrawing,drawingComponents,toolStatus])
    
    return (
        <div className="BlankPage">
            <svg className="svg-sheet" 
            onClick={()=>{setIsDrawing(true)}}>
                {drawingComponents.map((comp, index) => {
                    let ComponentToRender = components[comp.compName]
                    return <ComponentToRender properties={comp.properties} key={index} />
                })}
            </svg>
        </div>
    )
}