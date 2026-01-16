import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    1
];

export default function MetaBalls({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);

    let circles = useRef([])

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize
        canvas.width = backgroundSize.width;
        canvas.height = backgroundSize.height;

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#F2B3EE");
        gradient.addColorStop(0.2, "#0C1859");
        gradient.addColorStop(0.4, "#2E40A6");
        gradient.addColorStop(0.6, "#3981BF");
        gradient.addColorStop(1, "#79C4F2");

        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.fillStyle = gradient;
        for (let i = 0; i < 100; i++) {
            let x = (Math.random() * width)
            let y = (Math.random() * width)
            let radius = Math.random() * 40 + 10
            let fx = Math.random() * 1 + 1
            let fy = Math.random() * 1 + 1
            let phaseX = Math.random() * Math.PI * 2
            let phaseY = Math.random() * Math.PI * 2
            circles.current.push([x,y,radius,fx,fy,phaseX,phaseY])
        }

        ctx.beginPath()
        for (let c of circles.current){
            ctx. moveTo(c[0],c[1])
            ctx.arc(...c.slice(0,3),0,Math.PI*2)
        }
        ctx.fill()

    }, [backgroundSize]);



    // // Function to update pixels near cursor4
    const updatePixels = (t,cursorPos) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas;
        const cx = width / 2;
        const cy = height / 2;
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#F2B3EE");
        gradient.addColorStop(0.2, "#0C1859");
        gradient.addColorStop(0.4, "#2E40A6");
        gradient.addColorStop(0.6, "#3981BF");
        gradient.addColorStop(1, "#79C4F2");

        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.fillStyle = gradient;
        // ctx.fillStyle = "white";

        ctx.beginPath()
        ctx.arc(cursorPos.x, cursorPos.y, 40, 0, Math.PI * 2)
        ctx.fill()

        // ctx.filter = "blur(5px)";
        ctx.shadowColor = gradient;
        ctx.shadowBlur = 10;
        
        ctx.beginPath()
        for (let c of circles.current){
            ctx. moveTo(c[0],c[1])
            ctx.arc(...c.slice(0,3),0,Math.PI*2)
        }
        ctx.fill()

        circles.current = circles.current.map(c=>{
            let newC = [...c]
            newC[0] += Math.sin(t * newC[3] + newC[5]);
            newC[1] += Math.sin(t * newC[4] + newC[6]);
            return newC;
        })

    };

    // Animation loop
    useEffect(() => {
        if(!cursorPos) return
        const { width, height } = canvasRef.current;
        let frame;
        let startTime = performance.now()
        const animate = (time) => {
            let t = (time - startTime) / 1000
            updatePixels(t,cursorPos);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [cursorPos]);

    useEffect(() => {

        const updateCursorPos = (event) => {
            setCursorPos({
                x: event.clientX,
                y: event.clientY
            })
        }

        window.addEventListener("mousemove", updateCursorPos)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor: "#0D0126",

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
