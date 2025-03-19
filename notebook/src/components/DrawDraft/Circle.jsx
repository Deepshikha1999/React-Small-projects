import { useMemo } from "react"

export default function Circle({ properties }) {
    const coords = useMemo(() => { return properties.points.split(" ").map((prop) => (prop.split(","))) }, [properties])
    return (
        <circle
            cx={coords[0][0]}
            cy={coords[0][1]}
            r={properties.radius}
            stroke={properties.strokeColor}
            strokeWidth={properties.strokeWidth}
            fill={properties.fill}
        />
    )
}