import { useEffect, useRef, useState } from "react";
import "./../styles/InsertionSort.css";
import anime from "./../assets/anime-oriental-landscape.jpg";

const createArray = (n = 10, picture) => {
    if (picture) {
        return shuffle(n);
    }

    let arr = Array.from({ length: n }, (_, i) => {
        return Math.floor(Math.random() * 1000)
    });

    return arr;
}

const shuffle = (n) => {
    let array = Array.from({ length: n }, (_, i) => {
        return (i + 1)
    })
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function InsertionSort({ }) {
    const [randomArray, setArray] = useState([])
    const [arraySize, setArraySize] = useState(5)
    const [sort, setSort] = useState(false)
    const [message, setMessage] = useState("")

    const [indices, setIndices] = useState({
        loopIndex: 1,
        swapIndex: 0,
        keyValue: 0
    })

    const [pageSize, setPageSize] = useState(null)
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const imageRef = useRef(null)
    const [picture, setPicture] = useState(false)

    useEffect(() => {
        let mainDiv = document.getElementsByClassName("Main")[0];
        let width = mainDiv.clientWidth;
        let height = mainDiv.clientHeight;

        setPageSize({
            width,
            height
        })
    }, [])

    useEffect(() => {
        if (!pageSize) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;
        canvas.width = Math.floor(2 * width / 3);
        canvas.height = Math.floor(2 * height / 3);

        // ctx.fillStyle = "#0074D8";
        // ctx.fillRect(0, 0, canvas.width, canvas.height)
        const img = new Image();
        img.src = anime;
        img.onload = () => {
            imageRef.current = img;
        }

    }, [pageSize])

    const handleChange = (e) => {
        const value = e.target.value;

        if (value === "") {
            setArraySize("");
            return;
        }

        const n = Number(value);
        if (isNaN(n)) return;

        setArraySize(Math.max(5, Math.min(100, n)));
    }

    const startSort = () => {
        let arr;
        if (!arraySize) {
            arr = createArray(10, picture)
        }
        else
            arr = createArray(arraySize, picture)

        setArray(arr)
        setSort(true)
        setMessage("Sorting ...")
        setIndices({
            loopIndex: 1,
            swapIndex: 0,
            keyValue: arr[1]
        })
    }

    const stopSort = () => {
        setSort(false)
        setMessage("Sorting done...")
    }

    const drawBar = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx || !randomArray || randomArray.length === 0) return;

        const { width, height } = canvas;

        // clear full canvas
        ctx.clearRect(0, 0, width, height);

        const barWidth = Math.floor(width / randomArray.length);
        const maxValue = Math.max(...randomArray);

        randomArray.forEach((value, index) => {
            const barHeight = (value / maxValue) * height;
            const x = index * barWidth;
            const y = height - barHeight;

            ctx.fillStyle = "#0487D9";
            if (index === indices.swapIndex + 1) {
                ctx.fillStyle = "#F22D1B";
            }
            if (index >= randomArray.length - indices.loopIndex) {
                ctx.fillStyle = "#F2DB66";
            }
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        });
    }

    const drawPicture = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const img = imageRef.current;

        if (!canvas || !ctx || !img || randomArray.length === 0) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const tiles = randomArray.length;
        const cols = tiles;        // 1D strip (like bars)
        const rows = 1;

        const srcW = img.width / cols;
        const srcH = img.height;

        const dstW = width / cols;
        const dstH = height;

        randomArray.forEach((tileIndex, drawIndex) => {
            const sx = (tileIndex - 1) * srcW; // value → source slice
            const sy = 0;

            const dx = drawIndex * dstW;       // index → canvas slot
            const dy = 0;

            ctx.drawImage(
                img,
                sx, sy, srcW, srcH,
                dx, dy, dstW, dstH
            );
        });
    };

    useEffect(() => {
        if (!randomArray.length) return;
        picture ? drawPicture() : drawBar();
    }, [randomArray, picture, indices, sort]);


    useEffect(() => {
        if (!sort || randomArray.length === 0) return;

        const timeout = setTimeout(() => {
            const n = randomArray.length;
            let { loopIndex, swapIndex, keyValue } = indices;
            const arr = [...randomArray]
            if (loopIndex >= n) {
                stopSort();
                return;
            }

            if (swapIndex >= 0 && randomArray[swapIndex] > keyValue) {
                arr[swapIndex + 1] = arr[swapIndex];
                swapIndex = swapIndex - 1;
            }
            else {
                arr[swapIndex + 1] = keyValue;
                // Move to the next element in the array
                const nextLoopIndex = loopIndex + 1;
                if (nextLoopIndex < n) {
                    loopIndex = nextLoopIndex;
                    swapIndex = nextLoopIndex - 1;
                    keyValue = arr[nextLoopIndex]
                } else {
                    loopIndex = nextLoopIndex;
                }
            }

            setArray(arr)
            setIndices({
                loopIndex: loopIndex,
                swapIndex: swapIndex,
                keyValue: keyValue
            })

        }, 100); // Adjusted speed for better visualization

        return () => clearTimeout(timeout);
    }, [sort, randomArray, indices]);


    return (
        <div className="InsertionSort">
            <h1 className="Title">Insertion Sort</h1>
            <div className="InputPanel">
                <label> Enter Array Size {"<5 - 100>"}</label>
                <input
                    type="number"
                    min="5"
                    max="100"
                    name="ArraySize"
                    value={arraySize}
                    onChange={handleChange}
                    disabled={sort}
                    style={{ color: "black" }}
                />
                <button onClick={startSort} disabled={sort} style={{ color: "black" }}>Sort</button>
                <button onClick={stopSort} disabled={!sort} style={{ backgroundColor: "crimson", color: "white" }}>Stop</button>
                <input
                    type="checkbox"
                    checked={picture}
                    onChange={(e) => setPicture(e.target.checked)}
                    name="BarOrPicture"
                    disabled={sort}
                />
                Picture Representation
            </div>
            <div className="Message">{message}</div>
            <div className="Board">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    )
}