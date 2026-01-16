import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function BoxMotion({  }) {
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

    const [change,setChange] = useState({
        x: 0,
        y: 0
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

    const v = 10;
    const j = 30;
    const g = 15;

    const movingObject = useRef({
        x: 50, y: 50
    });

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

    }, [backgroundSize]);


    // // Function to update pixels near cursor4
    const updatePixels = (t) => {
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

        console.log(change, t)
        pos.current = {
            x: Math.min(width/2 - movingObject.current.x, Math.max(0, pos.current.x + change.x * t)),
            y: Math.min((height / 2) - movingObject.current.y, pos.current.y + change.y * t + 0.5 * g * t * t)
        }

        ctx.fillRect(pos.current.x, pos.current.y, movingObject.current.x, movingObject.current.y)
    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return
        if (!change) return
        let frame;
        let startTime = performance.now()
        // const { width, height } = canvasRef.current;

        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(t);
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
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                x = -v
            }

            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                x = v
            }

            if (e.key === " ") {
                y = -j
            }

            setChange({
                x,
                y
            })

          
        }

        const removeMove = (e) => {
          setChange({
            x:0,
            y:0
          })
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
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
