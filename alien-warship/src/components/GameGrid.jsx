import { useEffect, useRef, useState } from "react";
import Player from "./Player";
import Enemy from "./Enemy";

export default function GameGrid({ setHighestScore, setGameStart}) {
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
    const keyPressed = useRef(new Set())
    const [speed, setSpeed] = useState(10)
    const [shoot, setShoot] = useState([])
    const shootingRef = useRef(false)
    const [time, setTime] = useState(0)
    const [aliens, setAliens] = useState([])
    const [alienSpeed, setAlienSpeed] = useState(2)
    const timeToCreateNewAlien = useRef(500)
    const [gameLife, setGameLife] = useState(10)
    const [score, setScore] = useState(0)
    //Timer
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(currTime => {
                if (currTime + 1000 % 2000 == 0) {
                    setSpeed(oldSpeed => oldSpeed + 0.5)
                }
                if (currTime + 1000 % timeToCreateNewAlien.current == 0) {
                    setAlienSpeed((speedA) => speedA + 1)
                }
                return currTime + 1000
            })
        }, 1000)
        return () => { clearInterval(timeInterval) }
    }, [])

    //Create aliens
    useEffect(() => {
        const gameGrid = document.querySelector("#GameGrid").getBoundingClientRect()
        const player = document.querySelector("#Player").getBoundingClientRect()
        if (time % timeToCreateNewAlien.current == 0) {
            if (gameLife > 0) {
                setAliens((currAliens) => {
                    let arr = []
                    let newAliens = currAliens.length ? [...currAliens] : []
                    // for (let i = 0; i < 1; i++) {
                        let x = Math.floor(Math.random() * (gameGrid.width + gameGrid.left - gameGrid.left) + gameGrid.left)
                        while (arr.includes(x) || arr.includes(x + player.width) || (x + player.width > gameGrid.width + gameGrid.left)) {
                            x = Math.floor(Math.random() * (gameGrid.width + gameGrid.left - gameGrid.left) + gameGrid.left)
                        }
                        arr.push(x)
                        if (score % 100 == 0 && score > 0) {
                            newAliens.push({
                                x: x,
                                y: 0,
                                life: 100,
                                scale: 2,
                                score: 20
                            })
                        }
                        else {
                            newAliens.push({
                                x: x,
                                y: 0,
                                life: 20,
                                scale: 1,
                                score:1
                            })
                        }
                    // }
                    return [...newAliens]
                })
            }
            else {
                setAliens([])
            }
        }
    }, [time])

    // Initial state of player
    useEffect(() => {
        const player = document.querySelector("#Player").getBoundingClientRect()
        const [playerHeight, playerWidth] = [player.height, player.width]

        const gameGrid = document.querySelector("#GameGrid").getBoundingClientRect()
        const [gameGridHeight, gameGridWidth] = [gameGrid.height, gameGrid.width]

        setPlayerPos({
            x: gameGridWidth / 2 + 2 * playerWidth,
            y: gameGridHeight - 2 * playerHeight
        })
    }, [])

    // Player movement
    useEffect(() => {
        const gameGrid = document.querySelector("#GameGrid").getBoundingClientRect()
        const player = document.querySelector("#Player").getBoundingClientRect()
        const handleMovement = () => {
            setPlayerPos((currPos) => {
                let [x, y] = [currPos.x, currPos.y]
                if (keyPressed.current.has("ArrowLeft") || keyPressed.current.has("a"))
                    x = Math.max((x - speed), gameGrid.left)
                if (keyPressed.current.has("ArrowRight") || keyPressed.current.has("d"))
                    x = Math.min((x + speed), gameGrid.left + gameGrid.width - player.width)

                if (keyPressed.current.has(" ") && !shootingRef.current) { // Handlee shooting
                    shootingRef.current = true; // Prevent instant spam
                    setShoot((currShot) => [
                        ...currShot,
                        { x: x + player.width / 2, y: y - player.height / 3 } // Adjust bullet spawn position
                    ]);
                    setTimeout(() => (shootingRef.current = false), 100); // Limit fire rate
                }
                return { x, y }
            })

            requestAnimationFrame(handleMovement)
        }
        const animationFrame = requestAnimationFrame(handleMovement)
        return () => {
            cancelAnimationFrame(animationFrame)
        }
    }, [])


    // Move Aliens
    useEffect(() => {
        const enemy = document.querySelector("#Player").getBoundingClientRect();
        const gameGrid = document.querySelector("#GameGrid").getBoundingClientRect()
        const moveAliens = () => {
            setAliens((currAliens) => {
                return currAliens
                    .map((alien) => ({ ...alien, y: alien.y + Math.random() * alienSpeed * 2 })) // Move remaining aliens down Math.random() * 
                    .filter((alien) => {
                        if ((alien.y + enemy.height) <= gameGrid.top + gameGrid.height) {
                            return alien
                        }
                        else {
                            setGameLife(life => life - 1)
                        }
                    }).filter((alien) => {
                        if (alien.life > 0)
                            return alien
                        else {
                            setScore(score_curr => score_curr + alien.score)
                        }
                    })
            });

            requestAnimationFrame(moveAliens);
        };

        const animationFrame = requestAnimationFrame(moveAliens);
        return () => cancelAnimationFrame(animationFrame);
    }, []); // Include shoot in dependencies

    // Move Bullets & check collision with Aliens
    useEffect(() => {
        const enemy = document.querySelector("#Player").getBoundingClientRect();
        const moveBullets = () => {
            setShoot((currShoot) =>
                currShoot
                    .map((shot) => ({ ...shot, y: shot.y - 2 * speed }))
                    .filter((shot) => shot.y > 0)
            );

            setShoot((currShoot) =>
                currShoot
                    .map((shot) => ({ ...shot, y: shot.y - speed }))
                    .filter((shot) => shot.y > 0).filter((shot) => {
                        setAliens((currAliens) => {
                            return currAliens.filter((alien) => {
                                let xRange = [alien.x, alien.x + enemy.width];
                                let yRange = [alien.y, alien.y + enemy.height];
                                let isHit = shot.x >= xRange[0] && shot.x <= xRange[1] && shot.y >= yRange[0] && shot.y <= yRange[1];
                                // if (!isHit) {
                                //     // return alien;
                                // }
                                if (isHit) {
                                    
                                    alien.life -= 1
                                }
                                return alien;
                            });
                        });
                        return shot;
                    })
            );
            requestAnimationFrame(moveBullets);
        };

        const animationFrame = requestAnimationFrame(moveBullets);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    function handleOnKeyDown(event) {
        keyPressed.current.add(event.key)
    }
    function handleOnKeyUp(event) {
        keyPressed.current.delete(event.key)
    }

    useEffect(() => {
        window.addEventListener("keydown", handleOnKeyDown)
        window.addEventListener("keyup", handleOnKeyUp)

        return () => {
            window.removeEventListener("keydown", handleOnKeyDown)
            window.removeEventListener("keyup", handleOnKeyUp)
        }
    }, [keyPressed, playerPos])

    return (
        <div className="GameGrid" id="GameGrid">
            <div className="Life">
                {Array.from({ length: gameLife }, (_, i) => {
                    return <div className="LiFeHeart" key={i}></div>
                })}
            </div>
            <div className="Score">Score : {score}</div>
            <button className="Exit" onClick={()=>{
                setGameStart(false)
            }}>EXIT</button> 
            <Player playerPos={playerPos} />
            {
                aliens.map((alien, i) => {
                    return <Enemy alienPos={alien} key={i} />
                })
            }
            {gameLife>0 && shoot.map((shot, i) => {
                return <div className="Bullet" key={i} style={{
                    position: "absolute",
                    top: `${shot.y}px`,
                    left: `${shot.x}px`,
                }}></div>
            })}
            {
                gameLife<=0 && <div className="GameOver">
                    <h1>YOUR SCORE: {score}</h1>
                    <button onClick={
                        ()=>{
                            setGameStart(false)
                            setHighestScore(old_score=>Math.max(old_score,score))
                        }
                    }> REPLAY </button>
                </div>
            }
        </div>
    )
}