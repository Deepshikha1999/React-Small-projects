import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function RandomSelectionBox({}) {
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

    const v = 10;
    const grid = useRef([])

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

        ctx.fillRect(width / 2, height - 20, 20, 20)
        pos.current = {
            x: width / 2,
            y: height - 20
        }

        for (let i = 0; i < width; i += 50) {
            let a = []
            for (let j = 0; j < height; j += 50) {
                a.push({
                    x: i,
                    y: j,
                    val: Math.random() >= 0.5 ? 1 : 0
                })
            }
            grid.current.push(a)
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
            x: Math.min(width - 20, Math.max(0, pos.current.x + change.current.x)),
            y: Math.min(height - 20, Math.max(0, pos.current.y + change.current.y))
        }

        ctx.fillRect(pos.current.x, pos.current.y, 20, 20)

        let c = { ...pos.current }
        c.x = Math.floor((c.x - Math.floor(c.x) % 50) / 50)
        c.y = Math.floor((c.y - Math.floor(c.y) % 50) / 50)

        ctx.fillStyle = "white";
        for (let i = 0; i < grid.current.length; i++) {
            for (let j = 0; j < grid.current[0].length; j++) {
                if (grid.current[i][j].val == 1) {
                    if (c.x == i && c.y == j)
                        ctx.fillRect(grid.current[i][j].x, grid.current[i][j].y, 50, 50)
                    else
                        ctx.strokeRect(grid.current[i][j].x, grid.current[i][j].y, 50, 50)
                }
            }
        }
        // ctx.shadowColor = "rgba(255,255,255,0.5)";
        // ctx.shadowBlur = 20;
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        if (!change.current) return
        let frame;
        let startTime = performance.now()
        const { width, height } = canvasRef.current;
        const animate = (time) => {
            let t = (time - startTime) / 1000
            // startTime = time;
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
            <div className = "message">Use up and down and left and right arrow keys !</div>
        </div>
    );
}
