import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function SnakeAndFood({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());
    const pos = useRef({
        x: 0, y: 0
    })

    useEffect(() => {
        const backgroundChange = (e) => {
            setBackgroundSize({
                height: window.innerHeight,
                width: window.innerWidth,
            })
        }
        window.addEventListener("resize", backgroundChange)
        return () => {
            window.removeEventListener("resize", backgroundChange)
        }
    }, [])

    const change = useRef({
        x: 0,
        y: 0
    })

    const food = useRef(null)

    const v = 10;
    const grid = useRef([])

    const snakeLength = useRef({
        x: 20, y: 20
    });

    useEffect(() => {

        let { width, height } = { ...backgroundSize }
        let cn = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        }
        food.current = { ...cn }

    }, [])

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize
        canvas.width = backgroundSize.width;
        canvas.height = backgroundSize.height;
        // const img = new Image();
        // img.src = image1;
        // img.onload = () => {
        //     imageDataRef.current = img;
        // };
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#662400");
        gradient.addColorStop(0.2, "#B33F00");
        gradient.addColorStop(0.4, "#FF6B1A");
        gradient.addColorStop(0.6, "#006663");
        gradient.addColorStop(1, "#00B3AD");
        // gradient.addColorStop(0, "blue");
        // gradient.addColorStop(1, "white");

        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.fillStyle = gradient;

        ctx.fillRect(width / 2, height - 20, snakeLength.current.x, snakeLength.current.y)
        pos.current = {
            x: width / 2,
            y: height - 20
        }

    }, [backgroundSize]);


    // // Function to update pixels near cursor4
    const updatePixels = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        const cx = width / 2;
        const cy = height / 2;
        ctx.clearRect(0, 0, width, height);

        // gradient stroke for flavor
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#662400");
        gradient.addColorStop(0.2, "#B33F00");
        gradient.addColorStop(0.4, "#FF6B1A");
        gradient.addColorStop(0.6, "#006663");
        gradient.addColorStop(1, "#00B3AD");
        // gradient.addColorStop(0, "blue");
        // gradient.addColorStop(1, "white");

        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.fillStyle = gradient;

        pos.current = {
            x: Math.min(width - snakeLength.current.x, Math.max(0, pos.current.x + change.current.x)),
            y: Math.min(height - snakeLength.current.y, Math.max(0, pos.current.y + change.current.y))
        }

        let c = { ...pos.current }
        // c.x = Math.floor((c.x - Math.floor(c.x) % 50) / 50)
        // c.y = Math.floor((c.y - Math.floor(c.y) % 50) / 50)
        let f = { ...food.current }
        // check the food in snake

        let rectArr = [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1]
        ]
        let snakeAteFood = false;
        // direction of increment
        let direction_ = [0, 0]
        for (let i = 0; i < rectArr.length; i++) {
            //h==w=> food size

            let coord = {
                x: f.x + rectArr[i][0] * 10,
                y: f.y + rectArr[i][1] * 10
            }

            if ((coord.x >= c.x && coord.x <= c.x + snakeLength.current.x) && (coord.y >= c.y && coord.y <= c.y + snakeLength.current.y)) {
                snakeAteFood = true;
                break;
            }
        }

        if (snakeAteFood) {
            snakeLength.current.x += 2;
            snakeLength.current.y += 2;
            let cn = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height)
            }
            food.current = { ...cn }
        }

        if (food.current)
            ctx.fillRect(food.current.x, food.current.y, 20, 20)

        ctx.fillStyle = "white";
        ctx.fillRect(pos.current.x, pos.current.y, snakeLength.current.x, snakeLength.current.y)
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        if (!change.current) return
        let frame;
        let startTime = performance.now()
        // const { width, height } = canvasRef.current;

        const animate = (time) => {
            let t = (time - startTime) / 1000

            updatePixels();
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [change]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRgba(
                [Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                    1]
            )
        }, 1000)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        const updateCursorPos = (event) => {
            setCursorPos({
                x: event.clientX,
                y: event.clientY
            })
        }

        const updateMove = (e) => {
            let [x, y] = [0, 0]
            if (e.key == "ArrowLeft") {
                x = -v
            }

            if (e.key == "ArrowRight") {
                x = v
            }

            if (e.key == "ArrowUp") {
                y = -v
            }

            if (e.key == "ArrowDown") {
                y = v
            }
            change.current = {
                x, y
            }
        }

        const removeMove = (e) => {
            change.current = {
                x: 0, y: 0
            }
        }

        window.addEventListener("mousemove", updateCursorPos)
        window.addEventListener("keydown", updateMove)
        window.addEventListener("keyup", removeMove)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
            window.removeEventListener("keydown", updateMove)
            window.removeEventListener("keyup", removeMove)

        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor: "black"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Use left & right, up & down arrow keys and feed the white box the color food !</div>
        </div>
    );
}
