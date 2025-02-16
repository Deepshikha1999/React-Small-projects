import { useEffect, useState } from "react";
import setBoard from "../misc/RandomBoardFix";

export default function Board({ level, onHandleNextLevel, randomImg, setGameOver, TotalLevel,setScore }) {
    const [totalFlips, setFlips] = useState(0)
    const [listIndices, setIndices] = useState([]);
    const [countMatches, setCountMatches] = useState(0);
    const [timer,setTimer] = useState(0)

    const [gameBoard, setGameBoard] = useState(
        Array.from({ length: level * level }, () => {
            return {
                "flipStatus": false,
                "imagePath": null
            }
        })
    );
    console.log(timer)
    useEffect(()=>{
        if(countMatches < (level * level) / 2){
            const interval = setInterval(()=>{
                setTimer(oldTime=>oldTime+1)
            },1000)
    
            return () => {
                clearInterval(interval);
              };
        }
        
    },[countMatches])

    useEffect(() => {
        setGameBoard(setBoard(
            Array.from({ length: level * level }, () => ({
                flipStatus: false,
                imagePath: null
            })),
            randomImg
        ));
    }, [randomImg, level]);

    useEffect(() => {
        if (totalFlips == 3) {
            setIndices(oldIndices => [oldIndices[2]])
            setFlips(1)
        }
    }, [totalFlips])

    useEffect(() => {
        if (listIndices.length == 2 && gameBoard[listIndices[0]].imagePath == gameBoard[listIndices[1]].imagePath) {
            setCountMatches(oldVal => oldVal + 1)
        }
    }, [gameBoard, listIndices])


    function handleFlip(index) {
        if (!listIndices.includes(index) && !gameBoard[index].flipStatus) {
            setGameBoard((board) => {
                const new_board = [...board]
                new_board[index].flipStatus = true
                if (listIndices.length == 2) {
                    if (new_board[listIndices[0]].imagePath == new_board[listIndices[1]].imagePath) {
                        new_board[listIndices[0]].imagePath = "https://www.ghibli.jp/gallery/ged003.jpg"
                        new_board[listIndices[1]].imagePath = "https://www.ghibli.jp/gallery/ged003.jpg"
                    }
                    else {
                        new_board[listIndices[0]].flipStatus = false
                        new_board[listIndices[1]].flipStatus = false
                    }
                }
                return new_board
            })
            setFlips(oldFlip => oldFlip + 1)
            setIndices(oldList => [...oldList, index])
        }
    }

    function onHandleExit() {
        if(level == TotalLevel){
            setGameOver(true)
        }
        else{
            onHandleNextLevel(); // Move to the next level first
        }
        setScore((oldScore=>{
           const newscore = Math.max((1000 -(timer*10)),100)
           return oldScore + newscore
        }))
        setGameBoard(setBoard(
            Array.from({ length: level * level }, () => ({
                flipStatus: false,
                imagePath: null
            })),
            randomImg
        ));
        setFlips(0);
        setIndices([]);
        setCountMatches(0);
        setTimer(0);
    }


    return (
        <>
            {
                (countMatches === (level * level) / 2) ?
                    (
                        <div className="dialog" style={{ color: "white" }}>
                            <h1>LEVEL COMPLETED</h1>
                            <h1>{(timer/60).toFixed(2)} s / {Math.max((1000 -(timer*10)),100)} score</h1>
                            <button onClick={onHandleExit}>{level == TotalLevel?"OVER":"NEXT"}</button>
                        </div>
                    ) : (
                        <div className="board" style={{
                            height: `${level * 10}vh`,
                            width: `${level * 10}vw`,
                            gridTemplateColumns: `repeat(${level}, 1fr)`,
                            gridTemplateRows: `repeat(${level}, 1fr)`
                        }}>
                            {gameBoard.map((card, index) => (
                                <div
                                    className="box"
                                    key={index}
                                    style={card.flipStatus ? {
                                        backgroundImage: `url('${card.imagePath}')`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover"
                                    } : {
                                        backgroundImage: "none"
                                    }}
                                    onClick={() => handleFlip(index)}
                                >
                                </div>
                            ))}
                        </div>
                    )
            }
        </>
    );

}
