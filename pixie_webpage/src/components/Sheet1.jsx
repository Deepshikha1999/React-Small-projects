import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet1.css"

const TITLE = "Hello World ! ........... ";
const randomCharacterString = () => {
    //48 to 125
    let randomString = "";
    for (let s of TITLE) {
        if (s === " ") {
            randomString += s;
        }
        else {
            randomString += String.fromCharCode(Math.floor((Math.random() * (125 - 48)) + 48))
        }
    }
    return randomString;
}

export default function Sheet1({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const defaultText = useRef(randomCharacterString())
    const textIndex = useRef(0)
    const lastTimeRef = useRef(0);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")
        ctxRef.current = ctx;
        const { width, height } = document.getElementsByClassName("Sheet1")[0].getBoundingClientRect()
        canvas.width = width;
        canvas.height = height;


        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = "rgb(0,0,0,1)";
        ctx.lineWidth = 1;
        ctx.font = "70px 'Jacquard 24', system-ui";
        ctx.fillStyle = "black";
        ctx.fillText(defaultText.current,  width/2-200, height/2);
    }, [])

    const updateCanvas = (time) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;

        if (time - lastTimeRef.current < 20) return;
        lastTimeRef.current = time;

        if (textIndex.current >= defaultText.current.length) {
            return;
        }
        let index = textIndex.current;
        let arr = defaultText.current.split("")
        arr[index] = TITLE[index]
        defaultText.current = arr.join("")

        ctx.clearRect(0, 0, width, height);
        ctx.font = "70px 'Jacquard 24', system-ui";
        ctx.fillStyle = "black";
        ctx.fillText(defaultText.current, width/2-200, height/2);

        textIndex.current += 1;
    }

    useEffect(() => {
        let frame;
        const animate = (time) => {
            updateCanvas(time)
            frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        return () => {
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div className="Sheet1">
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}