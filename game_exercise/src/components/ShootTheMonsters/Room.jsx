import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Player from "./Player";
import backgroundImg from "../../assets/Forest Game Background Illustration Design.jpeg"
import Spider from "./Spider";

const speedOfSpider = 10;
export default function Room({ }) {
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, scale: 1 })
    const playerRef = useRef(null);
    const roomRef = useRef(null);
    const [score, setScore] = useState(0)
    const spidersRef = useRef()
    const [spiders, setSpiders] = useState(null)
    const [web, setWeb] = useState([])
    const [isDead, setIsDead] = useState(false)
    const [timer, setTimer] = useState(0)
    const [timeOut, setTimeOut] = useState(1 * 60 * 1000)
    const [startGame, setStartGame] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)

    const [room, setRoom] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0
    })

    useEffect(() => {
        if (startGame) {
            const timeOutStart = setTimeout(() => {
                setShowInstructions(false)
            }, 2000)
            const timeOutStartGame = setTimeout(() => {
                setStartGame(false)
            }, timeOut)
            return () => {
                clearTimeout(timeOutStart)
                clearTimeout(timeOutStartGame)
            }
        }
    }, [startGame])

    useEffect(() => {
        if (startGame) {
            const timeInterval = setInterval(() => {
                setTimer((time) => (time + 100))
            }, 100)
            return () => clearInterval(timeInterval)
        }
    }, [startGame])


    useLayoutEffect(() => {
        function updatePlayerPosition() {
            const roomInfo = roomRef.current;
            if (!roomInfo) return;

            setPlayerPos({
                x: roomInfo.getBoundingClientRect().left + roomInfo.getBoundingClientRect().width / 2,
                y: roomInfo.getBoundingClientRect().top + roomInfo.getBoundingClientRect().height / 2,
                scale: 1
            });

            const { height, width, x, y } = roomInfo.getBoundingClientRect()
            setRoom({
                height,
                width,
                x, y
            })
        }

        updatePlayerPosition();
        window.addEventListener("resize", updatePlayerPosition);

        return () => window.removeEventListener("resize", updatePlayerPosition);
    }, []);

    useEffect(() => {
        if (room) {
            setSpiders(prev => {
                let [x, y] = [room.x + Math.floor(Math.random() * (room.width / 2)), room.y]
                setWeb([{
                    x: x,
                    y: y
                }])
                setIsDead(false)
                return {
                    x: x,
                    y: y
                }
            });
        }
    }, [room, isDead]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setSpiders(curr_Spider => {
                if (curr_Spider) {
                    setWeb((oldWebs) => { return [...oldWebs, { x: curr_Spider.x, y: curr_Spider.y }] })
                    return {
                        ...curr_Spider,
                        y: Math.min((curr_Spider.y + speedOfSpider), (room.y + (3 * room.height / 4)))
                    }
                }
            })
        }, 100)
        return () => clearInterval(timeInterval)
    }, [spiders])

    function HandleMouseMove(event) {
        const roomInfo = roomRef.current;
        const playerInfo = playerRef.current;
        const spiderInfo = spidersRef.current;
        if (!roomInfo || !playerInfo) return;

        const { height, width, x, y } = roomInfo.getBoundingClientRect();
        const [playerWidth, playerHeight] = [playerInfo.getBoundingClientRect().width, playerInfo.getBoundingClientRect().height];
        setPlayerPos((currPos) => {
            let [x1, y1] = [Math.max(Math.min(event.x, x + width - playerWidth), x), Math.max(Math.min(event.y, y + height - playerHeight), y)]
            if (spiderInfo) {
                let playerDimensions = playerInfo.getBoundingClientRect();
                let spidersDimension = spiderInfo.getBoundingClientRect();
                if (playerDimensions.x > spidersDimension.x && playerDimensions.x + playerDimensions.width < spidersDimension.x + spidersDimension.width
                    && playerDimensions.y > spidersDimension.y && playerDimensions.y + playerDimensions.height < spidersDimension.y + spidersDimension.height) {
                    setSpiders((lastPos) => {
                        setWeb((oldWebs) => { return [...oldWebs, { x: lastPos.x, y: lastPos.y }] })
                        return { ...lastPos, x: Math.max(x, Math.min((lastPos.x + speedOfSpider * (Math.random() < 0.5 ? -1 : 1)), x + width - spidersDimension.width)) }
                    })
                }
            }
            return {
                ...currPos,
                x: x1,
                y: y1
            }
        })
    }

    function shoot(event) {
        if (!startGame)
            setStartGame(true)
        const playerInfo = playerRef.current;
        if (!playerInfo) return;

        const spiderInfo = spidersRef.current;
        if (!spiderInfo) return;


        let playerDimensions = playerInfo.getBoundingClientRect();
        let spidersDimension = spiderInfo.getBoundingClientRect();
        if (playerDimensions.x > spidersDimension.x && playerDimensions.x + playerDimensions.width < spidersDimension.x + spidersDimension.width
            && playerDimensions.y > spidersDimension.y && playerDimensions.y + playerDimensions.height < spidersDimension.y + spidersDimension.height) {
            setIsDead(true)
            setScore((curr_Score) => (curr_Score + 1))
        }
    }

    useEffect(() => {
        window.addEventListener("mousemove", HandleMouseMove)
        window.addEventListener("click", shoot)
        window.addEventListener("mousedown", () => {
            setPlayerPos((curr_pos) => ({ ...curr_pos, scale: 0.8 }))
        })

        window.addEventListener("mouseup", () => {
            setPlayerPos((curr_pos) => ({ ...curr_pos, scale: 1 }))
        })

        window.addEventListener("keydown", (event) => {
            if (!startGame) {
                setStartGame(true)
                return;
            }
        })

        return () => {
            window.removeEventListener("mousemove", HandleMouseMove)
            window.removeEventListener("click", shoot)
            window.removeEventListener("mousedown", () => {
                setPlayerPos((curr_pos) => ({ ...curr_pos, scale: 0.8 }))
            })

            window.removeEventListener("mouseup", () => {
                setPlayerPos((curr_pos) => ({ ...curr_pos, scale: 1 }))
            })
            window.removeEventListener("keydown", (event) => {
                if (!startGame) {
                    setStartGame(true)
                    return;
                }
            })
        }
    }, [])

    return (
        <>
            <div className="Room" ref={roomRef} style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "55vh",
                width: "20vw",
                zIndex: "1",
                cursor: "none",
                backgroundImage: `url(${backgroundImg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"

            }}>
                <Player playerPos={playerPos} ref={playerRef} />
                {startGame && <>
                    {spiders && <Spider spiderRef={spidersRef} room={room} spiderPos={spiders} setSpiders={setSpiders} />}
                    {web && web.map((web_c, i) => {
                        return <div className="Web" key={i} style={{
                            position: "absolute",
                            top: `${web_c.y}px`,
                            left: `${web_c.x + 60}px`,
                            height: `${speedOfSpider}px`,
                            width: `0.05em`,
                            background: "linear-gradient(90deg,purple,gray,black)",
                            zIndex: 10
                        }}></div>
                    })}

                    <div className="Timer" style={{
                        fontSize: "3em",
                        color: "white",
                        zIndex: 1
                    }}>{(timer / (60000)).toPrecision(3)}</div>
                    {showInstructions && <div className="Score" style={{
                        fontSize: "0.5em",
                        color: "crimson",
                        top: `${room.top + room.height}px`,
                        position: "absolute",
                        zIndex: 2
                    }}>Click to shoot and kill the spider</div>}
                </>}
                {
                    !startGame && <div style={{
                        display: "grid",
                        placeItems: "center"
                    }}><div className="Score" style={{
                        fontSize: "1em",
                        color: "white"
                    }}>Press any key to start
                        </div>
                        <div className="Score" style={{
                            fontSize: "1em",
                            color: "purple"
                        }}>Spiders Kill: {score}</div></div>
                }
            </div>
        </>
    )
}