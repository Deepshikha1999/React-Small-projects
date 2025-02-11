import { useImperativeHandle, useRef } from "react";
import { createPortal } from 'react-dom';

export default function ResultModel({ ref, targetTime, remainingTime, onReset }) {
    const dialog = useRef();
    const userLost = remainingTime <= 0
    const score = Math.round((1 - (remainingTime / (targetTime * 1000))) * 100)
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    });

    return createPortal(
        <dialog ref={dialog} className="result-modal" open>
            {userLost && <h2>You Lost</h2>}
            {!userLost && <h2>You Score: {score}</h2>}
            <p>The target time was <strong>{targetTime} seconds.</strong></p>
            <p>You stopped the timer with <strong>{(remainingTime / 1000).toFixed(2)} seconds left.</strong></p>
            <form method="dialog" onSubmit={onReset}>
                <button>Close</button>
            </form>
        </dialog>,
        document.getElementById("modal")
    )
}

// createPortal will teleport the element in where ever html place we want to 