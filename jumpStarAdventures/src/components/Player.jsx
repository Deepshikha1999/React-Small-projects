import { forwardRef } from "react"

const Player = forwardRef(({playerPos}, ref) => {
    return (
        <div ref={ref} className="Player" style={{
            position: "absolute",
            top: `${playerPos.y}px`,
            left: `${playerPos.x}px`,
        }}></div>
    );
});

export default Player;