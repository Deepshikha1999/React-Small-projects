import { useEffect, useRef, useState } from "react";
import "./../styles/PrefixSum.css";
import PlayerImg from "./../assets/runPlayer.png";
const obstacleImages = import.meta.glob('./../assets/obstacles/*.png', { eager: true });
import backgroundImg from "./../assets/walkpath.jpg";
import pathImg from "./../assets/walkpath_bottom.png";
import cloud from "./../assets/cloud.png";

const speed = 5;
const gravity = 0.8;

export default function PrefixSum({ }) {
    const obstacleList = Object.values(obstacleImages).map((mod) => mod.default);
    const [message, setMessage] = useState("Press Space or Click to start");
    const canvasRef = useRef(null)
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
    const [distance, setDistance] = useState(0);
    const playerRef = useRef({
        x: 50,
        y: 0,
        vy: 0,
        onGround: true
    });
    const obstaclesRef = useRef([]);
    const lastSpawnRef = useRef(0);
    const lastTimeRef = useRef(0);
    const distanceRef = useRef(0);
    const [start, setStart] = useState(false);
    const playerImgRef = useRef(null);
    const slideRef = useRef(0);
    const ObstacleImageListRef = useRef(Array.from({ length: obstacleList.length }));
    const bgImgRef = useRef(null);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem("highScore");
        return saved ? parseInt(saved, 10) : 0;
    });

    const pathImgRef = useRef(null);
    const cloudRef = useRef(null);
    const cloudsRef = useRef([]);

    useEffect(() => {
        const div = document.getElementById("board");
        if (!div) return;

        const updateSize = () => {
            setPageSize({
                width: div.clientWidth,
                height: div.clientHeight
            });
        };

        updateSize(); // Initial call
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        if (!pageSize) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;
        const { width, height } = pageSize;
        canvas.width = width;
        canvas.height = height;

        const bgImage = new Image();
        bgImage.src = backgroundImg;
        bgImage.onload = () => {
            bgImgRef.current = bgImage;
            // ctx.drawImage(bgImage,
            //     0,0,bgImage.width,bgImage.height,
            //     0,0,width,height)
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0.9, "#C2E0F2");
        gradient.addColorStop(0.5, "#418EF2");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height)

        const [x, y] = [10, 2 * height / 3]
        ctx.fillStyle = "white";
        playerRef.current.y = y;

        const pathImage = new Image();
        pathImage.src = pathImg;
        pathImage.onload = () => {
            pathImgRef.current = pathImage;
            // ctx.fillRect(0, y + playerImage.height - 10, width, height/3);
            ctx.drawImage(pathImage,
                0, 0, pathImage.width, pathImage.height,
                0, y + playerImage.height - 10, width, height / 3)
        }


        const playerImage = new Image();
        playerImage.src = PlayerImg;
        playerImage.onload = () => {
            playerImgRef.current = playerImage;
        }

        const imageList = obstacleList.map((value, index) => {
            const img = new Image();
            img.src = value;
            img.onload = () => {
                ObstacleImageListRef.current[index] = img;
            }
        })

        const cloudImage = new Image();
        cloudImage.src = cloud;
        cloudImage.onload = () => {
            cloudRef.current = cloudImage;
        }

        ctx.fillStyle = "white";
        ctx.textAlign = "center";   // left | right | center | start | end
        ctx.textBaseline = "middle"; // top | middle | alphabetic | bottom
        ctx.font = '72px "Jersey 15", sans-serif';
        ctx.fillText(message.toString(), width / 2, height / 2)

    }, [pageSize])

    const draw = (time) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const playerImage = playerImgRef.current;
        const bgImage = bgImgRef.current;
        const pathImage = pathImgRef.current;
        if (!canvas || !ctx || !playerImage || !bgImage || !pathImage) return;

        const delta = time - lastTimeRef.current;

        const { width, height } = canvas;

        // background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0.9, "#C2E0F2");
        gradient.addColorStop(0.5, "#418EF2");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        // ctx.drawImage(bgImage,
        //     0,0,bgImage.width,bgImage.height,
        //     0,0,width,height)

        // ground
        const groundY = (2 * height) / 3;
        ctx.fillStyle = "white";
        // ctx.fillRect(0, groundY + playerImage.height - 10, width, height/3);
        ctx.drawImage(pathImage,
            0, 0, pathImage.width, pathImage.height,
            0, groundY + playerImage.height - 10, width, height / 3)

        // player
        const player = playerRef.current;
        player.vy += gravity;
        player.y += player.vy;
        if (player.y >= groundY) {
            player.y = groundY;
            player.vy = 0;
            player.onGround = true;
        }
        // ctx.fillRect(player.x, player.y, 50, 50);
        ctx.drawImage(playerImage,
            slideRef.current * 50, 0, 50, playerImage.height,
            player.x, player.y + 10 - playerImage.height, 100, 2 * playerImage.height);

        playerRef.current = { ...player };
        if (delta > 100) {
            slideRef.current = slideRef.current == 5 ? 0 : slideRef.current + 1;
            lastTimeRef.current = time;
        }

        // spawn obstacles (every 2 sec)
        if (time - lastSpawnRef.current > 2000) {
            obstaclesRef.current.push({
                x: width,
                y: groundY + playerImage.height - 50,
                width: 50,
                height: 50,
                img: Math.floor(Math.random() * obstacleList.length)
            });

            cloudsRef.current.push({
                x: width + Math.floor(Math.random() * 100),
                y: 100 + Math.floor(Math.random() * 50),
                width: 100,
                height: 50,
                img: cloudRef.current
            })
            lastSpawnRef.current = time;
        }

        // move & draw obstacles
        obstaclesRef.current = obstaclesRef.current
            .map(o => ({ ...o, x: o.x - speed }))
            .filter(o => o.x + o.width > 0);

        cloudsRef.current = cloudsRef.current
            .map(c => ({ ...c, x: c.x - Math.floor(Math.random() * speed) }))
            .filter(c => c.x + c.width > 0);

        obstaclesRef.current.forEach(o => {
            // ctx.fillRect(o.x, o.y, o.width, o.height);
            const img = ObstacleImageListRef.current[o.img];
            ctx.drawImage(img,
                0, 0, img.width, img.height,
                o.x, o.y, o.width, o.height)
        });

        cloudsRef.current.forEach(c => {
            const img = c.img;
            ctx.drawImage(img,
                0, 0, img.width, img.height,
                c.x, c.y, c.width, c.height)
        });

        for (let o of obstaclesRef.current) {
            const hit = (
                player.x < o.x + o.width &&
                player.x + 50 > o.x &&
                player.y < o.y + o.height &&
                player.y + playerImage.height > o.y
            );

            if (hit) {
                handleGameOver();
                return;
            }
        }

        distanceRef.current += speed;
        const finalScore = Math.floor(distanceRef.current / 100);
        setDistance(finalScore);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";   // left | right | center | start | end
        ctx.textBaseline = "middle"; // top | middle | alphabetic | bottom
        ctx.font = '72px "Jersey 15", sans-serif';
        ctx.fillText(finalScore.toString(), width / 2, height / 2)
    };

    const handleGameOver = () => {
        setStart(false);
        const finalScore = Math.floor(distanceRef.current / 100);
        setDistance(finalScore);
        setHighScore(prev => Math.max(prev, finalScore));
        setMessage(`Crash! Score: ${finalScore}. Press Space to Retry`);

        // Reset Refs
        playerRef.current = { x: 50, y: 0, vy: 0, onGround: true };
        obstaclesRef.current = [];
        lastSpawnRef.current = 0;
        distanceRef.current = 0;
        const ctx = ctxRef.current;
        const { width, height } = canvasRef.current;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";   // left | right | center | start | end
        ctx.textBaseline = "middle"; // top | middle | alphabetic | bottom
        ctx.font = '48px "Jersey 15", sans-serif';
        ctx.fillText(message.toString(), width / 2, height / 2)
    };


    useEffect(() => {
        if (!start) return;
        let frame;
        const animate = (time) => {
            draw(time);
            frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);

    }, [start])

    useEffect(() => {
        const s = start;
        const jump = (e) => {
            if ((e.key == " " || e.key == "ArrowUp" || e.button == "0")) {
                if (!s) {
                    setStart(true)
                }
                if (playerRef.current.onGround) {
                    playerRef.current.vy = -18; // jump strength
                    playerRef.current.onGround = false;
                }
            }

        };

        window.addEventListener("keydown", jump);
        window.addEventListener("mousedown", jump);

        return () => {
            window.removeEventListener("keydown", jump);
            window.removeEventListener("mousedown", jump);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("highScore", highScore);
    }, [highScore])

    return (
        <div className="PrefixSum">
            <h1 className="Title">Prefix Sum: Walking!</h1>
            {/* <div className="Message">{highScore}</div> */}
            <div className="Board" id="board">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    )
}