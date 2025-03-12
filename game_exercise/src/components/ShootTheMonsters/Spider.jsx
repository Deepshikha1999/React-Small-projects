import { useEffect, useRef } from "react";
import monsterFace from "../../assets/Spider.png";

export default function Spider({ spiderRef,room, spiderPos, setSpiders }) {
    // const spiderRef = useRef(null); 

    return (
        <div 
            className="Spider" 
            ref={spiderRef} 
            style={{
                width: "5vw",
                height: "10vh",
                backgroundImage: `url(${monsterFace})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                animation: "bounceRotate 1s ease-in-out infinite",
                top: `${spiderPos.y}px`, // Added "px" for positioning
                left: `${spiderPos.x}px`,
                position: "absolute"
            }}
        />
    );
}
