// import { useState } from 'react';

export default function GameBoard({ onSelectSquare, gameboard }) {
    // const [gameboard, setGameboard] = useState(initialGameboard);

    // function handleSelectSquare(rowIndex, columnIndex) {
    //     setGameboard((prevgameBoard) => {
    //         let newGameBoard = [...prevgameBoard.map(item => [...item])];
    //         if (!newGameBoard[rowIndex][columnIndex])
    //             newGameBoard[rowIndex][columnIndex] = activePlayer;
    //         return newGameBoard;
    //     });
    //     onSelectSquare();
    // }
    
    return <ol id="game-board">
        {gameboard.map((row, rowIndex) =>
            <li key={rowIndex}>
                <ol>
                    {row.map((playerSymbol, columnIndex) =>
                        <li key={columnIndex}>
                            <button onClick={() => onSelectSquare(rowIndex, columnIndex)} disabled={playerSymbol?true:false}>
                                {playerSymbol}
                            </button>
                        </li>)}
                </ol>
            </li>)}
    </ol>
}