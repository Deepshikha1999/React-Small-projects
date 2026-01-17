import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

export default function Pendulum({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const frameRef = useRef(null); // store animation frame ID
    const [running, setRunning] = useState(false);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [rgba, setRgba] = useState([Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
        0.5])
    const boundarySize = [200, 400];
    const radius = boundarySize[0] / 2;
    const r = 10;

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

    const createBackgroundImg = (ctx, width, height) => {
        let x1 = width / 2 - boundarySize[0] / 2
        let y1 = height / 2 - boundarySize[1] / 2
        let x2 = x1 + boundarySize[0]
        let y2 = y1 + boundarySize[1]

        let xc = (x1 + x2) / 2
        let yc1 = y1
        let yc2 = y2
        let bias = 2

        ctx.lineWidth = 20
        ctx.strokeStyle = "white"
        // ctx.strokeRect(x1, y1, boundarySize[0], boundarySize[1])

        ctx.beginPath()
        ctx.moveTo(x1, y1 - bias)
        ctx.lineTo(x1, y2 + bias)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x2, y1 - bias)
        ctx.lineTo(x2, y2 + bias)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(
            xc,
            yc1,
            radius,
            Math.PI,
            0
        )
        ctx.strokeStyle = "white"
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(
            xc,
            yc2,
            radius,
            Math.PI * 2,
            Math.PI
        )
        ctx.strokeStyle = "white"
        ctx.stroke()

    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize
        canvas.width = backgroundSize.width;
        canvas.height = backgroundSize.height;
    }, [backgroundSize]);

    // Function to update pixels near cursor
    const updatePixels = (angle) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        ctx.clearRect(0, 0, width, height)

        let x1 = width / 2 - boundarySize[0] / 2
        let y1 = height / 2 - boundarySize[1] / 2

        createBackgroundImg(ctx, width, height,)

        let l = (3 * boundarySize[1] / 4) + radius
        let [c, s] = [Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180)]
        let xl1 = x1 + boundarySize[0] / 2
        let yl1 = y1 - radius
        let xl2 = xl1 + l * s
        let yl2 = yl1 + l * c
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(xl1, yl1)
        ctx.lineTo(xl2, yl2)
        ctx.strokeStyle = "white"
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(
            xl2,
            yl2 + r,
            r,
            0,
            Math.PI * 2
        )
        ctx.fillStyle = "white"
        ctx.fill()
    };

    // Animation loop
    useEffect(() => {
        // let frame;
        // const start = performance.now();
        // const animate = (time) => {
        //     const t = (time - start) / 1000; // seconds
        //     const angle = 12 * Math.sin(t); // oscillates between -15° and +15°
        
        //     updatePixels(angle);
        
        //     frame = requestAnimationFrame(animate);
        // };
        // frame = requestAnimationFrame(animate);
        // return () => cancelAnimationFrame(frame);
    }, []);


    useEffect(() => {
        // let angle = 1
        const intervalId = setInterval(() => {
            setRgba([Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.random()])
            // updatePixels(angle);
            // angle = (angle + 10)%360
        }, 100)
        return () => clearInterval(intervalId)
    }, [])

    const animate = (startTime)=>{
        const time  = (performance.now()-startTime) / 1000;
        const angle = 15 *  Math.sin(time*2); // oscillation
        updatePixels(angle);
        frameRef.current = requestAnimationFrame(() => animate(startTime));
    }

    const stopAnimation = ()=>{
        setRunning(false);
        cancelAnimationFrame(frameRef.current)
    }

    useEffect(()=>{
        const intervalId = setTimeout(()=>{
            stopAnimation()
        },14000)
        return ()=> clearTimeout(intervalId)
    },[])

    useEffect(() => {
        const updateCursorPos = (event) => {
            setCursorPos({
                x: event.clientX,
                y: event.clientY
            })
        }

        const startAnimation = ()=>{
                if(!running){
                    setRunning(true);
                    const ctx = canvasRef.current.getContext("2d");
                    ctxRef.current = ctx;
                    frameRef.current = requestAnimationFrame(()=>
                        animate(performance.now())
                    );
                }
        }

        window.addEventListener("mousemove", updateCursorPos)
        window.addEventListener("mousedown", startAnimation)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
            window.removeEventListener("mousedown", startAnimation)
        }
    }, [])

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`,
            backgroundColor : "black"

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Click to see changes !</div>
        </div>
    );
}
