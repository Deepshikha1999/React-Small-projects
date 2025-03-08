export default function Player({ playerPos}) {
    return (
        <div className="Player" id="Player" style={{
            top:`${playerPos.y}px`,
            left:`${playerPos.x}px`,
            position:"absolute"
        }}></div>
    )
}