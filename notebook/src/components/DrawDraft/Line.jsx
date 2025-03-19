import { useMemo } from "react"

export default function Line({ properties }) {
    const coords = useMemo(()=>{return properties.points.split(" ").map((prop)=>(prop.split(",")))},[properties])
    return (
        <line
            x1={coords[0][0]}
            x2={coords[coords.length-1][0]}
            y1={coords[0][1]}
            y2={coords[coords.length-1][1]}
            stroke={properties.strokeColor}
            strokeWidth={properties.strokeWidth} />
    )
}