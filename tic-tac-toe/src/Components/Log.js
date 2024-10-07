export default function Log({ turns }) {

    return <ol id="log">
        {turns.map(turn => {
            return <li key={`${turn.square.row}|${turn.square.column}`}>
                <p>{turn.player} selected {turn.square.row},{turn.square.column}</p>
            </li>
        })}
    </ol>
}