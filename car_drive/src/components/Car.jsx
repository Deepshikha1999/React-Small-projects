import { useState, useEffect, useRef } from "react"
import car from "../assets/car3.png"

const ACCELERATION = 1;
const CAR_SPEED = 10;
const TURN_RATE = 5;
const FRICTION = 0.05;
export default function Car({stripsRef, sideScenesRef}) {
    const [carPos, setCarPos] = useState({ x: innerWidth / 2, y: innerHeight - 200 })
    const velocity = useRef({ x: 0, y: 0 })
    const rotate = useRef(0)
    const keyPresses = useRef(new Set())
    const speed = useRef(0)
    console.log(stripsRef.current.map((strip)=>{
        const stripInfo = strip.getBoundingClientRect();
        return {x: stripInfo.left,y:stripInfo.top}
    }))
    console.log(sideScenesRef)
    const handleMovement = ()=>{
        if (keyPresses.current.has("a") || keyPresses.current.has("ArrowLeft")) {
            rotate.current -= TURN_RATE
        }
        if (keyPresses.current.has("d") || keyPresses.current.has("ArrowRight")) {
            rotate.current += TURN_RATE
        }
        if (keyPresses.current.has("w") || keyPresses.current.has("ArrowUp")) {
            speed.current = Math.min(CAR_SPEED, speed.current + ACCELERATION);
        }
        if (keyPresses.current.has("s") || keyPresses.current.has("ArrowDown")) {
            speed.current = Math.max(0, speed.current - ACCELERATION * 2);
        }
    }

    useEffect(() => {
        const updatePosition = () => {
            if (!keyPresses.current.has("w") && !keyPresses.current.has("ArrowUp")) {
                speed.current = Math.max(0, speed.current - FRICTION);
            }
            setCarPos(oldPos => ({
                x: Math.max(0, Math.min(window.innerWidth - 50, oldPos.x + velocity.current.x)),
                y: Math.max(window.innerHeight/4, Math.min(window.innerHeight - 50, oldPos.y + velocity.current.y))
            }));
            velocity.current.x = Math.sin(rotate.current * (Math.PI / 180)) * speed.current;
            velocity.current.y = -Math.cos(rotate.current * (Math.PI / 180)) * speed.current;
            requestAnimationFrame(updatePosition);
        };
        const animationFrame = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    useEffect(()=>{
        const updateMovement = ()=>{
            handleMovement()
            requestAnimationFrame(updateMovement)
        }
        const animationFrame = requestAnimationFrame(updateMovement)
        return ()=>cancelAnimationFrame(animationFrame);
    },[])

    function handleKeyDown(event) {
        keyPresses.current.add(event.key)
    }
    function handleKeyUp(event){
        keyPresses.current.delete(event.key)
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup",handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup",handleKeyUp);
        };
    }, []);
    return <img className="Car" src={car} alt="Car" style={{
        top: `${carPos.y}px`,
        left: `${carPos.x}px`,
        position: "absolute",
        // transition: "top 0.1s linear, left 0.1s linear",
        transform: `rotateZ(${rotate.current}deg)`,
        zIndex: "1"
    }} />
}