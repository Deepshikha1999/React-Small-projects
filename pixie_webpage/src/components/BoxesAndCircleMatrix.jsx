import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function BoxesAndCircleMatrix({ }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState(getRandomRgba());

    const grid = useRef([])

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

        let arr = []
        for (let i = 0; i < width; i += 40) {
            let a = [];
            for (let j = 0; j < height; j += 40) {
                a.push({
                    value: Math.random() >= 0.5 ? 1 : 0,
                    x: i,
                    y: j
                })
            }
            arr.push(a)
        }

        grid.current = arr.map(item => [...item])

    }, [backgroundSize]);


    // // Function to update pixels near cursor4
    const updatePixels = (cpos) => {
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

        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.fillStyle = gradient;


        // ctx.beginPath()
        // for (let i = 0; i<width; i+=20){
        //     ctx.moveTo(i,0)
        //     ctx.lineTo(i,height)
        // }

        // for (let j= 0; j< height;j+=20){
        //     ctx.moveTo(0,j)
        //     ctx.lineTo(width,j)
        // }

        // ctx.stroke()


        // let cposX = Math.floor(cpos.x - (Math.floor(cpos.x) % 40)) / 40
        // let cposY = Math.floor(cpos.y - (Math.floor(cpos.y) % 40)) / 40
        // // console.log(grid.current[cposX][cposY])
        // let c = grid.current[cposX][cposY]
        // ctx.beginPath()
        for (let i = 0; i < grid.current.length; i++) {
            for (let j = 0; j < grid.current[0].length; j++) {
                // ctx.strokeRect(grid.current[i][j].x, grid.current[i][j].y, 40, 40);
                // if (cposX == i && cposY == j) {
                //     grid.current[i][j].value = 1;
                // }

                if (grid.current[i][j].value == 1) {
                    ctx.moveTo(grid.current[i][j].x+20, grid.current[i][j].y+20)
                    // ctx.fillRect(grid.current[i][j].x, grid.current[i][j].y, 40, 40);
                    ctx.strokeRect(grid.current[i][j].x, grid.current[i][j].y, 40, 40);
                    // ctx.arc(grid.current[i][j].x+20, grid.current[i][j].y+20,20,0,Math.PI*2)
                }
            }
        }
        // ctx.fill()


    };

    // Animation loop
    useEffect(() => {
        // if (!cursorPos) return

        let frame;
        let startTime = performance.now()
        const { width, height } = canvasRef.current;
        const animate = (time) => {
            let t = (time - startTime) / 1000
            // startTime = time;
            updatePixels(cursorPos);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

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
            backgroundColor: "black"
        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
