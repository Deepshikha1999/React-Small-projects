import { createPortal } from "react-dom";
import gameOverGif from "../assets/Flappybird1.jpg";
export default function Start_Page({onStart}) {
    return createPortal(
        <dialog className="result-modal" open >
            <img src={gameOverGif} alt="GAME OVER" style={{
                paddingLeft:"20%"
            }} />
            <h2>Use Up arrow ⬆️  to keep the bird in air</h2>
            <h2>avoid crashing clouds and walls</h2>
            <form method="dialog" onSubmit={onStart}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <button
                    style={{
                        alignItems: "center"
                    }}>START</button>
            </form>
        </dialog>, document.body
    )
}