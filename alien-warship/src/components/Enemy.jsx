export default function Enemy({ alienPos }) {
    return (
        <div className="Enemy" style={{
            position: "absolute",
            top: `${alienPos.y}px`,
            left: `${alienPos.x}px`,
            transform:`scale(${alienPos.scale})`
        }}></div>
    )
}