export default function StartPage({ setGame,setLevel }) {
    return (
        <div className="Start">
            <h1>MATCH UP</h1>
            <button onClick={() => {
                setGame(true)
                setLevel()
            }}>PLAY</button>
        </div>
    )
}