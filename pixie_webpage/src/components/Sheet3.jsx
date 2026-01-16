import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet3.css"

export default function Sheet3({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const lastTimeRef = useRef(0);
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const [isClicked,setIsClicked] = useState(false);

    useEffect(() => {
        const backgroundChange = (e) => {
            setBackgroundSize({
                height: window.innerHeight,
                width: window.innerWidth,
            })
        }

        const changeStatus = ()=>{
            setIsClicked(click=>!click)
        }

        window.addEventListener("resize", backgroundChange)
        window.addEventListener("mousedown",changeStatus)
        window.addEventListener("mouseup",changeStatus)
        return () => {
            window.removeEventListener("resize", backgroundChange)
            window.removeEventListener("mousedown",changeStatus)
            window.removeEventListener("mouseup",changeStatus)
        }
    }, [])


    useEffect(() => {
        if (!backgroundSize) return;
        const canvas = canvasRef.current;
        const ctx = !ctxRef.current ? canvas.getContext("2d") : ctxRef.current;
        ctxRef.current = ctx;
        const { width, height } = backgroundSize;
        canvas.width = width;
        canvas.height = height;


        ctx.fillStyle = "rgba(0,0,0,1)";
        // ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 1;

        for (let i = 0; i <= width; i += 20) {
            for (let j = 0; j <= height; j += 20) {
                ctx.fillStyle = "rgba(0,0,0,"+Math.random()+")";
                ctx.fillRect(i,j,20,20)
            }
        }

    }, [backgroundSize])

    const updateCanvas = (time) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;

        ctx.clearRect(0,0,width,height)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height)

        const randomColors = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)]
        for (let i = 0; i <= width; i += 20) {
            for (let j = 0; j <= height; j += 20) {
                ctx.fillStyle = "rgba("+randomColors.join(",")+","+Math.random()+")";
                ctx.fillRect(i,j,20,20)
            }
        }
    }

    useEffect(() => {
        if(!isClicked) return;
        updateCanvas(0)
    }, [isClicked])

    return (
        <div className="Sheet3" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}