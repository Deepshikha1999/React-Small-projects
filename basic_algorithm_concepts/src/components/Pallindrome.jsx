import { useEffect, useRef, useState } from "react";
import "./../styles/Pallindrome.css";

import cross from "../assets/moon.png";
import right from "../assets/sun.png";

const info = "Pallindrome: a word, phrase, or sequence that reads the same backwards as forwards, e.g. madam.";
const gameRule = "Game rule: The user have 2 choices to make either row, column or diagonal pallindrome, the one finishing first will win.";


export default function Pallindrome({ }) {

    const [message, setMessage] = useState("Pallindrome");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const moonRef = useRef(null);
    const sunRef = useRef(null);
    const [player, setPlayer] = useState(true);
    const [computer, setComputer] = useState(false);
    const ticTacToeArray = useRef([]);
    const [drag, setDrag] = useState(false);
    const moonPos = useRef(null);
    const sunPos = useRef(null);
    const [selectSymbol, setSelectSymbol] = useState(null);
    const properties = useRef(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
        let count = 0;
        const handleLoad = () => {
            count++;
            if (count == 2) {
                setIsLoaded(true);
            }
        }

        const imgC = new Image();
        imgC.src = cross;
        imgC.onload = handleLoad;
        moonRef.current = imgC;

        const imgR = new Image();
        imgR.src = right;
        imgR.onload = handleLoad;
        sunRef.current = imgR;

    }, [])

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("pallindrome_board");
            const { left, top } = divClass.getBoundingClientRect();
            setPageSize({
                width: divClass.clientWidth,
                height: divClass.clientHeight,
                x: left,
                y: top
            })
        }

        updatePageSize()
        window.addEventListener("resize", updatePageSize);
        return () => {
            window.removeEventListener("resize", updatePageSize);
        }
    }, [])

    const drawLayout = (ctx, width, height, arr, props) => {

        ctx.clearRect(0, 0, width, height);

        let bgColor = ["#08428C", "#D9C355"]
        ctx.fillStyle = bgColor[Math.random() > 0.5 ? 1 : 0]
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.strokeStyle = "white";

        let { x, y, w, h, w1, h1 } = props;

        //tic tac toe board side
        ctx.fillRect(x, y, w, h);

        ctx.beginPath();
        for (let i = 1; i < 4; i++) {
            ctx.moveTo(x + i * w1, y);
            ctx.lineTo(x + i * w1, y + h1 * 4);

            ctx.moveTo(x, y + i * h1);
            ctx.lineTo(x + 4 * w1, y + i * h1);
        }
        ctx.stroke();

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let X = x + i * w1;
                let Y = y + j * h1;
                if (arr[i][j] == 1 && moonRef.current?.complete) {
                    ctx.drawImage(moonRef.current, X, Y, w1, h1);
                }
                else if (arr[i][j] == 0 && sunRef.current?.complete) {
                    ctx.drawImage(sunRef.current, X, Y, w1, h1);
                }
            }
        }

        // pickups and scoreboard
        ctx.fillRect(x + w + 2 * x, y, w, h);

        ctx.fillStyle = "rgba(0,0,0,0.5)";

        ctx.fillRect(x + w + 2 * x, y, w, h / 2);

        ctx.fillStyle = "rgba(255,255,255,0.7)";

        // cross and right for user to play

        moonPos.current = { x: (3 * x) + w + (w1 / 2), y: y + (h1 / 2), w: w1, h: h1 };
        sunPos.current = { x: (3 * x) + (3 * w / 2) + (w1 / 2), y: y + (h1 / 2), w: w1, h: h1 };



        if (moonRef.current?.complete) {
            ctx.drawImage(moonRef.current, (3 * x) + w + (w1 / 2), y + (h1 / 2), w1, h1);
        }
        else {
            ctx.fillRect((3 * x) + w + (w1 / 4), y + (h1 / 4), w1, h1);
        }
        if (sunRef.current?.complete) {
            ctx.drawImage(sunRef.current, (3 * x) + (3 * w / 2) + (w1 / 2), y + (h1 / 2), w1, h1)
        }
        else {
            ctx.fillRect((3 * x) + (3 * w / 2) + (w1 / 4), y + (h1 / 4), w1, h1);
        }


        // player info
        let x1 = x + w + 2 * x + 10;
        let y1 = y + 10 + h / 2;
        ctx.fillRect(x1, y1, w - 20, h / 2 - 20);
        const font = 20;
        ctx.font = `${font}px "Irish Grover", system-ui`;
        ctx.textBaseline = "top";

        ctx.fillStyle = "black";
        ctx.fillText(message, x1 + w / 2 - ctx.measureText(message).width / 2, y1 / 2 + h / 2);
    }

    const initiate = () => {
        let arr = Array.from({ length: 4 }, () => {
            return Array.from({ length: 4 }, () => null)
        })
        return arr;
    }

    useEffect(() => {
        if (!pageSize || !isLoaded) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;

        canvas.width = width;
        canvas.height = height;

        let w = width / 2 - 50;
        let h = height - 50;
        let x = 25;
        let y = 25;
        let w1 = w / 4;
        let h1 = h / 4;

        const props = {
            x: x,
            y: y,
            w1: w1,
            h1: h1,
            w: w,
            h: h
        };
        properties.current = props;

        let newArr = initiate();
        ticTacToeArray.current = newArr;
        drawLayout(ctx, width, height, newArr, props);

    }, [pageSize, isLoaded])

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (drag && start) {
            // console.log(offsetX, offsetY)
            // move pos
            const ctx = ctxRef.current;
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

    }

    const handleSelect = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        // select the piece
        const ctx = ctxRef.current;

        if (!moonPos.current || !sunPos.current || !player || !start) return;

        const { x: x1, y: y1, w: w1, h: h1 } = moonPos.current;
        const { x: x2, y: y2, w: w2, h: h2 } = sunPos.current;

        if (offsetX < x1 + w1 && offsetX > x1
            && offsetY < y1 + h1 && offsetY > y1) {
            setDrag(true);
            setSelectSymbol("moon");
        }
        if (offsetX < x2 + w2 && offsetX > x2
            && offsetY < y2 + h2 && offsetY > y2) {
            setDrag(true);
            setSelectSymbol("sun");
        }

    }

    const handleUnselect = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const draGVal = drag;
        const playerVal = player;
        if (draGVal && properties.current && ticTacToeArray.current && ctxRef.current && canvasRef.current && playerVal && start) {
            setDrag(false);
            setPlayer(false);
            setComputer(true);
            let { x, y, w1, h1 } = properties.current;
            let arr = ticTacToeArray.current;

            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    if (offsetX > x + i * w1 && offsetX < x + (i + 1) * w1
                        && offsetY > y + j * h1 && offsetY < y + (j + 1) * h1
                        && arr[i][j] === null) {
                        arr[i][j] = selectSymbol == "sun" ? 0 : 1;
                    }
                }
            }

            if (checkWinner(arr)) {
                setMessage("Player Wins! Symmetry restored.");
                setStart(false);
            }
            else if (checkDraw(arr)) {
                setMessage("Game Draw");
                setStart(false);
            }

            drawLayout(ctxRef.current, canvasRef.current.width, canvasRef.current.height, arr, properties.current);
            ticTacToeArray.current = arr;
        }
        // place the piece
    }

    useEffect(() => {
        if (computer && start) {
            // Simple AI delay for realism
            setTimeout(() => {
                let arr = [...ticTacToeArray.current];

                // Basic AI: Find first empty spot and place a random symbol
                let placed = false;
                for (let i = 0; i < 4 && !placed; i++) {
                    for (let j = 0; j < 4 && !placed; j++) {
                        if (arr[i][j] === null) {
                            arr[i][j] = Math.random() > 0.5 ? 0 : 1;
                            placed = true;
                        }
                    }
                }

                if (checkWinner(arr)) {
                    setMessage("Computer Wins! Symmetry restored.");
                    setStart(false);
                }

                else if (checkDraw(arr)) {
                    setMessage("Game Draw");
                    setStart(false);
                }

                drawLayout(ctxRef.current, pageSize.width, pageSize.height, arr, properties.current);
                setComputer(false);
                setPlayer(true);
            }, 600);
        }
    }, [computer, start]);

    const drawHighlights = (indices) => {
        const ctx = ctxRef.current;
        const props = properties.current;
        if (!ctx || !props) return;

        const { x, y, w1, h1 } = props;
        ctx.strokeStyle = "purple";

        indices.forEach(val => {
            ctx.strokeRect(x + w1 * val[0], y + h1 * val[1], w1, h1);
        })

    }

    const checkWinner = (arr) => {
        const isPalindrome = (line) => {
            if (line.some(cell => cell === null)) return false;
            // Check if index 0 == 3 and 1 == 2
            return line[0] === line[3] && line[1] === line[2];
        };

        // 1. Check Rows
        for (let i = 0; i < 4; i++) {
            if (isPalindrome(arr[i])) {
                drawHighlights([[i, 0], [i, 1], [i, 2], [i, 3]]);
                return true;
            }
        }

        // 2. Check Columns
        for (let j = 0; j < 4; j++) {
            const col = [arr[0][j], arr[1][j], arr[2][j], arr[3][j]];
            if (isPalindrome(col)) {
                drawHighlights([[0, j], [1, j], [2, j], [3, j]]);
                return true;
            }
        }

        // 3. Check Diagonals
        const diag1 = [arr[0][0], arr[1][1], arr[2][2], arr[3][3]];
        const diag2 = [arr[0][3], arr[1][2], arr[2][1], arr[3][0]];
        if (isPalindrome(diag1)) {
            drawHighlights([[0, 0], [1, 1], [2, 2], [3, 3]])
            return true;
        }

        if (isPalindrome(diag2)) {
            drawHighlights([[0, 3], [1, 2], [2, 1], [3, 0]])
            return true;
        }

        return false;
    };

    const checkDraw = (arr) => {
        for (let i = 0; i < 4; i++) {
            if (arr[i].some(cell => cell === null)) return false;
        }
        return true;
    }

    const handleStart = () => {
        setStart(true);
        initiate();
        let newArr = initiate();
        ticTacToeArray.current = newArr;
        drawLayout(ctxRef.current, pageSize.width, pageSize.height, newArr, properties.current);
        setPlayer(prev => !prev);
        setComputer(prev => !prev);
        setMessage("Pallindrome");
    }

    useEffect(() => {
        if (!ctxRef.current || !pageSize || !canvasRef.current || !properties.current || !ticTacToeArray.current) return;
        drawLayout(ctxRef.current, pageSize.width, pageSize.height, ticTacToeArray.current, properties.current);
    }, [message])


    return (
        <div className="Pallindrome">
            <h1 className="Title">Pallindromic TicTacToe</h1>
            <div className="Message">{info}</div>
            <div className="Message">{gameRule}
                <button
                    style={{
                        border: "none",
                        padding: "0.2rem",
                        backgroundColor: !start ? "crimson" : "#00B6BF",
                        color: "white",
                        fontSize: "1rem"
                    }}
                    onClick={handleStart}
                    disabled={start}>{start ? "On Going" : "Game start"}</button>
            </div>
            <div className="Board" id="pallindrome_board">
                <canvas ref={canvasRef}
                    onMouseDown={handleSelect}
                    onMouseUp={handleUnselect}
                    onMouseMove={handleMouseMove}>
                </canvas>
            </div>
        </div>
    )
}