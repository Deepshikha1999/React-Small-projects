import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"

const MAX_TIME = 5000
const V0 = 10
export default function Player({ obstaclePos }) {
    const playerRef = useRef(null);
    const [playerPos, setPlayerPos] = useState({ x: 750, y: 500 })
    const [time, setTime] = useState(0)
    const [keyPressed, setKeyPressed] = useState(false)
    const [directionToMove, setDirectionToMove] = useState([0, 0])
    const [rotate, setRotate] = useState(0)
    const [gravity, setGravity] = useState(true)
    // console.log(window.innerHeight,window.innerWidth)

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setPlayerPos((oldPos) => {
                if (gravity && oldPos.y + 70 <= window.innerHeight) {
                    console.log("Obstacle:", obstaclePos, "Player:", oldPos);
                    return {
                        x: oldPos.x + directionToMove[0],
                        y: oldPos.y + V0
                    };
                }
                return oldPos;
            });
        }, 25);

        return () => clearInterval(timeInterval);
    }, [gravity, obstaclePos]);

    // Tracks time
    useEffect(() => {
        let timeInterval;
        if (keyPressed) {
            timeInterval = setInterval(() => {
                setTime((oldTime) => oldTime + 10);
            }, 10);
        } else {
            clearInterval(timeInterval);
        }

        return () => clearInterval(timeInterval);
    }, [keyPressed]);

    // Changes position based on time, direction to move and key pressed
    useEffect(() => {
        if (keyPressed && time <= MAX_TIME && time >= 0) {
            setPlayerPos((oldPos) => {
                return { x: (oldPos.x + directionToMove[0]), y: (oldPos.y + directionToMove[1]) }
            })
            setRotate(oldRotate => oldRotate + 10);
        }
    }, [directionToMove, time])

    // moves left , right, top , bottom when key is down
    function move(event) {
        console.log(event)
        if (!keyPressed) {
            setKeyPressed(true);
        }

        let [x, y] = [0, 0]
        if (event.key == "ArrowUp") {
            y = -1 * V0
        }
        if (event.key == "ArrowDown") {
            y = V0
        }
        if (event.key == "ArrowRight") {
            x = V0
        }
        if (event.key == "ArrowLeft") {
            x = -1 * V0
        }
        setDirectionToMove([x, y])
    }

    // stops motion when key is up
    function stopMoving(event) {
        setKeyPressed(false)
        setTime(0)
    }

    // handles motion and keyboard orders
    useEffect(() => {
        window.addEventListener("keydown", move)
        window.addEventListener("keyup", stopMoving)
        return () => {
            window.removeEventListener("keydown", move)
            window.removeEventListener("keyup", stopMoving)
        }
    }, [])
    return <div ref={playerRef} className="player"

        style={{
            position: "absolute",
            top: `${playerPos.y}px`,
            left: `${playerPos.x}px`,
            transform: `rotate(${rotate}deg)`
        }}
    > <div className="ball"></div></div>
}