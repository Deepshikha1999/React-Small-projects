import { useEffect } from "react";
import Block from "./Block";
import { useRef } from "react";
import { useState } from "react";

export default function GameBoard({ }) {
    const gameBoardRef = useRef(null)
    const [position, setPosition] = useState([])

    const speedOfBlock = 10
    const directionOfMovement = useRef(1)
    const [isMoving, setIsMoving] = useState(true);
    const [start, setStartGame] = useState(false);
    const layoutRef = useRef(null)
    function StartGame(){
        const gameBoard = gameBoardRef.current;
        if (!gameBoard) return

        const [height, width, X, Y] = [gameBoard.offsetHeight, gameBoard.offsetWidth, gameBoard.offsetLeft, gameBoard.offsetTop]

        if (start) {
            setPosition((oldPos) => ([{
                x: X,
                y: height + Y - 50,
                height: 50,
                width: 200
            }]))
        }
    }
    useEffect(() => {
       StartGame()
    }, [start])

    useEffect(() => {
        if (!isMoving) {
            setIsMoving(true)
        }
        const timeInterval = setInterval(() => {
            const gameBoard = gameBoardRef.current;
            if (!gameBoard) return

            const [height, width, X, Y] = [gameBoard.offsetHeight, gameBoard.offsetWidth, gameBoard.offsetLeft, gameBoard.offsetTop]
            setPosition((oldPos) => {
                let poses = [...oldPos]
                let newPos = { ...oldPos[oldPos.length - 1] }
                if (newPos.x == width - newPos.width) {
                    directionOfMovement.current = -1
                }
                else if (newPos.x == 0) {
                    directionOfMovement.current = 1
                }
                newPos.x += speedOfBlock * directionOfMovement.current
                poses[poses.length - 1] = newPos
                return poses
            })
        }, 10)

        return () => clearInterval(timeInterval)

    }, [isMoving])

    useEffect(() => {
        const stopBlockMovement = () => {
            const gameBoard = gameBoardRef.current;
            if (!gameBoard) return

            const [height, width, X, Y] = [gameBoard.offsetHeight, gameBoard.offsetWidth, gameBoard.offsetLeft, gameBoard.offsetTop]
            setPosition((oldPos) => {
                let newPos = [
                    ...oldPos,
                ]
                let prevPos = { ...oldPos[oldPos.length - 1] }
                if (newPos.length >= 2) {
                    let prevPos = { ...oldPos[oldPos.length - 1] }
                    if (prevPos.x <= oldPos[oldPos.length - 2].x)
                        prevPos.width = Math.abs(prevPos.x + prevPos.width - oldPos[oldPos.length - 2].x)
                    else {
                        prevPos.width = Math.abs(oldPos[oldPos.length - 2].x + oldPos[oldPos.length - 2].width - prevPos.x)
                    }
                    prevPos.width = Math.min(oldPos[oldPos.length - 2].width, prevPos.width)
                    prevPos.x = oldPos[oldPos.length - 2].x
                    newPos[oldPos.length - 1] = prevPos
                }
                if (prevPos.width > 10) {
                    newPos.push({
                        x: X,
                        y: prevPos.y - prevPos.height,
                        height: prevPos.height,
                        width: prevPos.width,
                    })
                }
                else{
                    setStartGame(false)
                }

                if (newPos.length > 5) {
                    return newPos.map((pos) => ({ ...pos, y: pos.y + pos.height }))
                }
                console.log(newPos)
                return newPos
            })
            setIsMoving(false)
        };

        const startGame = () => {
            setStartGame(true)
            StartGame()
        }

        window.addEventListener("mousedown", stopBlockMovement);
        window.addEventListener("click", startGame);
        return () => {
            window.removeEventListener("mousedown", stopBlockMovement);
            window.removeEventListener("click", startGame);
        };
    }, [])

    return (
        <div ref={gameBoardRef} className="gameBoard">
            {!start && <h1 style={{ color: "whitesmoke" }}> Click to start </h1>}
            {position.length > 0 && position.length <= 1 && <div className="blockLayout" ref={layoutRef} style={{
                height: `${position[0].height}px`,
                width: `${position[0].width}px`,
                backgroundColor: "none",
                border: "2px white dashed",
                top: `${position[0].y}px`,
                position: "absolute"
            }}></div>}
            {position.map((pos, i) => (
                <Block position={pos} key={i} />
            ))}
        </div>
    )
}