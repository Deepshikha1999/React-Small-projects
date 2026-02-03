import { useEffect, useRef, useState } from "react";
import "./../styles/SelectionSort.css";
import samurai from "../assets/samurai.webp";

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

export default function SelectionSort({ }) {
    const [randomArray, setArray] = useState([])
    const [arraySize, setArraySize] = useState(5)
    const [sort, setSort] = useState(false)
    const [message, setMessage] = useState("")

    const [indices, setIndices] = useState({
        loopIndex: 0,
        swapIndex: 1,
        maxIndex: 0
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
        img.src = samurai;
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
        if (!arraySize) {
            setArray(createArray(10, picture))
        }
        else
            setArray(createArray(arraySize, picture))

        setSort(true)
        setMessage("Sorting ...")
        setIndices({
            loopIndex: 0,
            swapIndex: 1,
            maxIndex: 0
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

            ctx.fillStyle = "#F2E95E";
            if (index === indices.swapIndex || index === indices.maxIndex) {
                ctx.fillStyle = "#5EF272";
            }
            if (index >= randomArray.length - indices.loopIndex) {
                ctx.fillStyle = "#FFF5B9";
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
            const { loopIndex, swapIndex, maxIndex } = indices;

            // 1. END CONDITION
            if (loopIndex >= n - 1) {
                stopSort();
                return;
            }

            const lastUnsorted = n - loopIndex - 1;

            // 2. FINISHED SCANNING CURRENT SECTION -> SWAP MAX TO THE END
            if (swapIndex > lastUnsorted) {
                setArray(prev => {
                    const copy = [...prev];
                    // Swap the found maxIndex with the last unsorted position
                    const temp = copy[lastUnsorted];
                    copy[lastUnsorted] = copy[maxIndex];
                    copy[maxIndex] = temp;
                    return copy;
                });

                // Reset indices for the NEXT pass
                setIndices({
                    loopIndex: loopIndex + 1,
                    swapIndex: 1, // Start scanning from the beginning again
                    maxIndex: 0   // Assume first element is max for the next pass
                });
                return;
            }

            // 3. COMPARE & MOVE SCANNER
            setIndices(prev => {
                let nextMax = prev.maxIndex;
                // If the scanner (swapIndex) finds a larger value than our current maxIndex
                if (randomArray[prev.swapIndex] > randomArray[prev.maxIndex]) {
                    nextMax = prev.swapIndex;
                }

                return {
                    ...prev,
                    maxIndex: nextMax,
                    swapIndex: prev.swapIndex + 1
                };
            });

        }, 100); // Adjusted speed for better visualization

        return () => clearTimeout(timeout);
    }, [sort, randomArray, indices]);


    return (
        <div className="SelectionSort">
            <h1 className="Title">Selection Sort</h1>
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
                />
                <button onClick={startSort} disabled={sort}>Sort</button>
                <button onClick={stopSort} disabled={!sort} style={{ backgroundColor: "black" }}>Stop</button>
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