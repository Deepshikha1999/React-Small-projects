import { useState, useRef } from 'react';

export default function Player() {

  const playerName = useRef() // using reference to get direct dom element access
  const [enteredPlayerName, setEnteredPlayerName] = useState(null) 
  // const [submitted, setSubmitted] = useState(false)
  // function handleChange(event) {
  //   setSubmitted((stateBool) => !stateBool)
  //   setEnteredPlayerName(event.target.value)
  // }

  function handleClick() {
    // setSubmitted((stateBool)=>!stateBool)\
    setEnteredPlayerName(playerName.current.value)
    playerName.current.value = ''
  }

  return (
    <section id="player">
      <h2>Welcome {enteredPlayerName ?? "unknown entity"}</h2>
      <p>
        <input
          ref={playerName}
          type="text"
          // onChange={handleChange}
          // value={enteredPlayerName} 
          />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
