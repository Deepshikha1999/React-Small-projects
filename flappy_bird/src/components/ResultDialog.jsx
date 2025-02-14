import { useImperativeHandle, useRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import gameOverGif from "../assets/gameOver.gif";

const ResultDialog = forwardRef(({ gameOverStatus, score, message, onReset }, ref) => {
    const dialog = useRef(null);

    useImperativeHandle(ref, () => ({
        open() {
            if (dialog.current) {
                dialog.current.showModal();
            }
        }
    }));

    return createPortal(
        <dialog ref={dialog} className="result-modal">
            <img src={gameOverGif} alt="GAME OVER"/>
            {message && <h2>{message}</h2>}
            {gameOverStatus && <h2>Your Score: {score}</h2>}
            <form method="dialog" onSubmit={onReset}>
                <button>Close</button>
            </form>
        </dialog>,
        document.body 
    );
});

export default ResultDialog;
