export default function PolyLine({properties}){
    return (
        <polyline
        points = {properties.points}
        stroke = {properties.strokeColor}
        strokeWidth = {properties.strokeWidth}
        fill = {properties.fill}
        />
    )
}