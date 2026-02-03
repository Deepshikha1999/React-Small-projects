import { useEffect, useRef, useState } from "react";
import "./../styles/Queue.css";
import apple from "../assets/apple_1010706.png";

const g = 50;
export default function Queue({ }) {
    const [message, setMessage] = useState("Snake Game, use any navigation key to start...");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState(null);
    const properties = useRef(null);
    const playerRef = useRef([]);
    const foodRef = useRef(null);
    const [direction, setDirection] = useState(null);
    const lastTimeRef = useRef(0);

    const appleImgRef = useRef(null);

    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        let loadCount = 0;
        const checkLoad = () => {
            loadCount++;
            if (loadCount === 1)
                setLoaded(true);
        }

        const appleImg = new Image();
        appleImg.src = apple;
        appleImg.onload = checkLoad;
        appleImgRef.current = appleImg;

    }, [])


    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("queue_board");
            setPageSize({
                width: divClass.clientWidth,
                height: divClass.clientHeight
            })
        }

        updatePageSize()
        window.addEventListener("resize", updatePageSize);
        return () => {
            window.removeEventListener("resize", updatePageSize);
        }
    }, [])

    const drawLayout = (ctx, width, height) => {
        ctx.fillStyle = "#00766A";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "#03A66A";
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let i = 0; i <= width; i += g) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
        }

        for (let j = 0; j <= height; j += g) {
            ctx.moveTo(0, j);
            ctx.lineTo(width, j);
        }
        ctx.stroke();
    }

    const snake = (ctx, player) => {
        if (!player.length) return;
        ctx.fillStyle = "#C9C8E8";
        ctx.beginPath();
        for (let [x, y] of player) {
            ctx.moveTo(g * (y + 0.5), g * (x + 0.5));
            ctx.arc(g * (y + 0.5), g * (x + 0.5), (g / 2) - 2, 0, (Math.PI * 355) / 180);
        }
        ctx.fill();


        const [headX, headY] = player[0];
        const hCenterX = headY * g + g / 2;
        const hCenterY = headX * g + g / 2;

        ctx.beginPath();
        ctx.fillStyle = "#E8ACB8"; // Highlight the head
        ctx.arc(hCenterX, hCenterY, g / 2, 0, Math.PI * 2);
        ctx.fill();


        // 3. Add "Eyes" for direction feedback
        ctx.fillStyle = "#083540";
        ctx.beginPath();
        // Simple eyes - you can offset these based on the 'direction' state later!
        ctx.arc(hCenterX - g / 3, hCenterY - g / 3, g / 5, 0, Math.PI * 2);
        ctx.arc(hCenterX + g / 3, hCenterY - g / 3, g / 5, 0, Math.PI * 2);
        ctx.moveTo(hCenterX , hCenterY);
        ctx.arc(hCenterX , hCenterY, g / 5, 0, Math.PI);
        ctx.fill();

    }

    const drawFood = (ctx, food) => {

        if (!food) return;
        let [x, y] = food;
        if (appleImgRef.current.complete) {
            const img = appleImgRef.current;
            ctx.drawImage(img,
                y * g, x * g, g, g);
        }
        else {
            ctx.fillStyle = "#FF2826";
            ctx.fillRect(y * g, x * g, g, g);
        }

    }


    useEffect(() => {
        if (!pageSize || !isLoaded) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        const w = Math.floor(width / 100) * 100;
        const h = Math.floor(height / 100) * 100;
        const m = Math.floor(w / g);
        const n = Math.floor(h / g);
        canvas.width = w;
        canvas.height = h;

        drawLayout(ctx, w, h);

        const props = {
            W: w,
            H: h,
            m: m,
            n: n
        }

        let x = Math.floor(n / 2);
        let y = Math.floor(m / 2);
        properties.current = props;
        const player = [[x, y]];
        playerRef.current = player;
        snake(ctx, player);

        let food = [Math.floor(Math.random() * n), Math.floor(Math.random() * m)];
        foodRef.current = food;
        drawFood(ctx, food);

    }, [pageSize, isLoaded])

    const draw = (time) => {
        const props = properties.current;
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;

        if (!props || !ctx || !canvas) return;

        if (time - lastTimeRef.current < 200) return;
        lastTimeRef.current = time;

        let player = [...playerRef.current];
        const d = direction;
        const { n, m, W, H } = props;
        let food = foodRef.current;

        ctx.clearRect(0, 0, W, H);
        drawLayout(ctx, W, H);

        // 1. QUEUE LOGIC: Calculate New Head (Front of Queue)
        const head = player[0];
        const newHead = [head[0] + direction[1], head[1] + direction[0]];

        // 2. VALIDATION: Wall Collision & Self-Collision
        const hitWall = newHead[0] < 0 || newHead[1] < 0 || newHead[0] >= n || newHead[1] >= m;
        const hitSelf = player.some(([x, y]) => x === newHead[0] && y === newHead[1]);

        if (hitWall || hitSelf) {
            setMessage("Game Over! Press any arrow key to restart.");
            // Reset Logic
            const resetX = Math.floor(n / 2);
            const resetY = Math.floor(m / 2);
            food = [Math.floor(Math.random() * n), Math.floor(Math.random() * m)];
            player = [[resetX, resetY]];
            playerRef.current = player;
            foodRef.current = food;
            setDirection(null);

            drawFood(ctx, food);
            snake(ctx, player);

            return;
        }

        // 3. ENQUEUE: Add new head to the front
        player.unshift(newHead);

        // 4. CHECK FOOD: If eaten, don't Dequeue (Snake grows)
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
            foodRef.current = [Math.floor(Math.random() * n), Math.floor(Math.random() * m)];
            setMessage("Delicious! Length: " + player.length);
        } else {
            // 5. DEQUEUE: Remove the tail if no food was eaten
            player.pop();
        }

        // 6. RENDER
        ctx.clearRect(0, 0, W, H);
        drawLayout(ctx, W, H);
        drawFood(ctx, foodRef.current);
        snake(ctx, player);

        playerRef.current = player;

    }

    useEffect(() => {
        if (!direction) return;
        let frame;
        const animate = (time) => {
            draw(time);
            frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);

    }, [direction])

    useEffect(() => {
        const handleKey = (e) => {
            let pos = [0, 0];
            if (e.key == "ArrowRight") {
                pos[0] = 1;
            }
            else if (e.key == "ArrowLeft") {
                pos[0] = -1
            }
            else if (e.key == "ArrowUp") {
                pos[1] = -1;
            }
            else if (e.key == "ArrowDown") {
                pos[1] = 1;
            }
            setDirection(pos);
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [])

    return (
        <div className="Queue">
            <h1 className="Title">Queue, snake game</h1>
            <div className="Message">{message}</div>
            <div className="Board" id="queue_board">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    )
}