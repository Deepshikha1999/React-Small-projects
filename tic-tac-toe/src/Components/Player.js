import { useState } from 'react';

export default function Player({ initialName, symbol, isActive, onChangeName }) {
    const [playerName, setPlayerName] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);
    let buttonname = isEditing ? "Save" : "Edit";
    function onClickEdit() {
        // setIsEditing(!isEditing);//not acceptable in react though it works
        setIsEditing((editing) => !editing); // acceptable and right way to update the current state
        if (isEditing)
            onChangeName(symbol, playerName);
    }
    let nameField = isEditing ? <input type="text" name="name" value={playerName} onChange={handleChange} required /> : playerName;
    function handleChange(event) {
        setPlayerName(event.target.value);
    }

    console.log("isActive in ", symbol, isActive)
    return <li className={isActive ? "active" : undefined}>
        <span className="player">
            <span className="player-name">{nameField}</span>
            <span className="player-symbol">{symbol}</span>
        </span>
        <button onClick={onClickEdit}>{buttonname}</button>
    </li>
}