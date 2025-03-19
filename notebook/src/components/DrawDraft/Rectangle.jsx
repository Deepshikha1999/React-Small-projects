import { useEffect, useMemo } from "react"

export default function Rectangle({ properties }) {
    const coords = useMemo(() => { return properties.points.split(" ").map((prop) => (prop.split(","))) }, [properties])
   
    return (
        <rect
            x={coords[0][0]}
            y={coords[0][1]}
            width={properties.width}
            height={properties.height}
            stroke={properties.strokeColor}
            strokeWidth={properties.strokeWidth}
            fill={properties.fill}
        />
    )
}