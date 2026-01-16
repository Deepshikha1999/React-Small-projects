import { useEffect, useRef, useState } from "react";
import "./../styles/Sheet.css";

const getRandomRgba = () => [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    0.5
];

export default function Constellation({}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [cursorPos, setCursorPos] = useState(null);
    const [listOfPoints, setListOfPoints] = useState([])
    const [rgba, setRgba] = useState(getRandomRgba)

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = backgroundSize
        canvas.width = backgroundSize.width;
        canvas.height = backgroundSize.height;

    }, [backgroundSize]);

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

    // Function to update pixels near cursor
    const updatePixels = (points) => {

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!ctx || !canvas) return;

        const { width, height } = canvas
        ctx.clearRect(0, 0, width, height)

        let connections = {}

        for(let i =0; i< points.length;i++){
            let x1 = points[i][1] * 3 + points[i][0]
            if(!connections[x1]){
                connections[x1] = []
            }
            ctx.beginPath()
            ctx.arc(...points[i],5,0,Math.PI*2)
            ctx.fillStyle = "#fff1e6"
            ctx.fill()
            ctx.shadowColor = "white"
            ctx.shadowBlur = 10
            let c = 0
            for(let j=0;j<points.length;j++){
                // let flag = true;
                let flag = Math.random()>0.5? true: false;
                let x2 = points[j][1] * 3 + points[j][0]
                if(i === j || !flag || (connections[x2] && connections[x2].includes(x1)) || (connections[x1] && connections[x1].includes(x2))){
                    continue;
                }
                if(!connections[x2]){
                    connections[x2] = []
                }

                connections[x1].push(x2)
                connections[x2].push(x1)
                c++;
                
                ctx.beginPath()
                ctx.moveTo(...points[i])
                ctx.lineTo(...points[j])
                ctx.lineWidth = 0.2
                ctx.strokeStyle = "white"
                ctx.stroke()
                if(c==2){
                    break;
                }
            }
        }

    };

    // Animation loop
    useEffect(() => {
        if (!cursorPos) return;

        let frame;
        let startTime = performance.now()
        let points = []
        let lastFrame = 0
        const fps = 65
        const frameInterval = 1000/fps
        for (let i = 0; i < 10; i++) {
            let x = Math.floor(Math.random() * ((cursorPos.x + 200) - (cursorPos.x - 200)) + cursorPos.x - 200 + Math.random() + 10)
            let y = Math.floor(Math.random() * ((cursorPos.y + 200) - (cursorPos.y - 200)) + cursorPos.y - 200 + Math.random() + 10)
            points.push([x,y])
        }
        const animate = (time) => {
            if(time - lastFrame> frameInterval){
                lastFrame = time;
                let t = (time - startTime) / 1000
                updatePixels(points);
                for (let i = 0; i < 5; i++) {
                    let x = Math.random() > 0.5? 1:-1
                    let y = Math.random() > 0.5? 1:-1
                    points[i][0] += x
                    points[i][1] += y
                }
                frame = requestAnimationFrame(animate);
            }
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
                Math.random()]
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

        window.addEventListener("mousemove", updateCursorPos)
        return () => {
            window.removeEventListener("mousemove", updateCursorPos)
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
