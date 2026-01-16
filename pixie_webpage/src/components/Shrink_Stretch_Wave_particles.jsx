import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function Shrink_Stretch_Wave_particles({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());

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

    const points = useRef([])

    const createPixelGrid = (width, height) => {
        let n = 10000
        let pixels = []
        let k = 0
        for (let i = 0; i < width; i += 5) {
            for (let j = 0; j < height; j += 5) {
                // if(k==n){
                //     break;
                // }
                let flag = Math.random() >= 0.5 ? true : false
                if (flag)
                    {
                        pixels.push([i, j])
                        k++
                    }
            }
            // if(k==n){
            //     break;
            // }
        }
        return pixels
    }

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize
        canvas.width = backgroundSize.width;
        canvas.height = backgroundSize.height;

        points.current = createPixelGrid(width, height)
        ctx.strokeStyle = "white"
        ctx.fillStyle = "white"
        ctx.save()
        ctx.beginPath()
        for (let p of points.current) {
            ctx.moveTo(...p)
            ctx.arc(...p, 5, 0, Math.PI * 2)
            // ctx.rect(...p, 5, 5)

        }
        ctx.fill()
        ctx.restore()

    }, [backgroundSize]);


    // // Function to update pixels near cursor
    const updatePixels = (pos, t) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        let gradient = ctx.createLinearGradient(0, 0, 0, height)

        // gradient.addColorStop(0, "white")
        // gradient.addColorStop(1, "black")
        gradient.addColorStop(0, "#662400")
        gradient.addColorStop(0.2, "#B33F00")
        gradient.addColorStop(0.4, "#FF6B1A")
        gradient.addColorStop(0.6, "#006663")
        gradient.addColorStop(1, "#00B3AD")

        // ctx.fillStyle = "rgba("+rgba.join(",")+")";
        ctx.fillStyle = gradient;

        /**negative will stretch the image, positive will shrink the image */
        // const delta = 10; // small wave // adding this will create pulse effect * Math.sin(t * 2)
        const influenceRadius = width; // how far cursor affects squares

        // const delta = 50 * Math.sin(t * 2); // pulse 
        const delta = 20; // shrink
        // const delta = -20; // stretch

        ctx.beginPath();
        for (let i = 0; i < points.current.length; i++) {
            const [px, py] = points.current[i];
            const dx = pos.x - px;
            const dy = pos.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let offsetX = 0, offsetY = 0;

            if (dist < influenceRadius) {
                const effect = (influenceRadius - dist) / influenceRadius; // 1 near cursor → 0 far away
                offsetX = dx / dist * delta * effect * 5;
                offsetY = dy / dist * delta * effect * 5;
            }

            // ctx.rect(px + offsetX, py + offsetY, 5, 5);
            ctx.moveTo(px + offsetX, py + offsetY)
            ctx.arc(px + offsetX, py + offsetY, 5, 0, Math.PI * 2)
        }
        ctx.fill();
    };


    // Animation loop
    useEffect(() => {
        if (!cursorPos) return
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(cursorPos, t);
            // if (t < 5)
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [cursorPos]);

    useEffect(() => {
        // let angle = 1
        const intervalId = setInterval(() => {
            setRgba(
                [Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                    1]
            )
            // updatePixels(angle);
            // angle = (angle + 10)%360
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

        const resetPoints = (event) => {
            points.current = createPixelGrid(canvasRef.current.width, canvasRef.current.height)
        }

        window.addEventListener("mousemove", updateCursorPos)
        // window.addEventListener("mouseup", resetPoints)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
            // window.removeEventListener("mouseup", resetPoints)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor:"black"

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
