import { useEffect, useRef, useState } from "react";
import "./../styles/CountSort.css";
import anime from "./../assets/image.png";

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

export default function CountSort({ }) {
    const [randomArray, setArray] = useState([])
    const [arraySize, setArraySize] = useState(5)
    const [sort, setSort] = useState(false)
    const [message, setMessage] = useState("")

    const [indices, setIndices] = useState({
        loopIndex: 1,
        countArr: [],
        maxValue: 0,
        resultArr: []
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

        let n = arr.length;
        setArray(arr)
        setSort(true)
        setMessage("Sorting ...")
        let maxV = Math.max(...arr)
        let cntArr = Array.from({ length: maxV + 1 }, (_, i) => 0)

        for (let i = 0; i < n; i++) {
            cntArr[arr[i]] += 1;
        }

        for (let i = 1; i <= maxV; i++) {
            cntArr[i] += cntArr[i - 1];
        }

        setIndices({
            loopIndex: n - 1,
            countArr: cntArr,
            maxValue: maxV,
            resultArr: new Array(n).fill(0)
        })
    }

    const stopSort = () => {
        setSort(false)
        setMessage("Sorting done...")
    }

    const drawBar = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const { resultArr, maxValue, loopIndex } = indices;
        if(!resultArr || resultArr.length===0) return; 
        if (!canvas || !ctx) return;

        const { width, height } = canvas;

        // clear full canvas
        ctx.clearRect(0, 0, width, height);

        const barWidth = width / resultArr.length;

        resultArr.forEach((value, index) => {
            if (value === 0) return;
            const barHeight = (value / maxValue) * height;
            const x = index * barWidth;
            const y = height - barHeight;

            ctx.fillStyle = "#0487D9";
            if (index == loopIndex) {
                ctx.fillStyle = "#F2DB66";
            }
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        });
    }

    const drawPicture = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const img = imageRef.current;
        const {resultArr} = indices;

        if (!canvas || !ctx || !img || resultArr.length === 0) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const tiles = resultArr.length;
        const cols = tiles;        // 1D strip (like bars)
        const rows = 1;

        const srcW = img.width / cols;
        const srcH = img.height;

        const dstW = width / cols;
        const dstH = height;

        resultArr.forEach((tileIndex, drawIndex) => {
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
            let { loopIndex, countArr, resultArr } = indices;
            let cntArr = [...countArr]
            let ans = [...resultArr]
            const arr = [...randomArray]
            if (loopIndex < 0) {
                stopSort();
                return;
            }

            ans[cntArr[arr[loopIndex]] - 1] = arr[loopIndex];
            cntArr[arr[loopIndex]] -= 1;
            loopIndex -= 1;

            setArray([...arr])
            setIndices({
                ...indices,
                "loopIndex": loopIndex,
                "countArr": [...cntArr],
                "resultArr": [...ans]
            })

        }, 100); // Adjusted speed for better visualization

        return () => clearTimeout(timeout);
    }, [sort, randomArray, indices]);


    return (
        <div className="CountSort">
            <h1 className="Title">Count Sort</h1>
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