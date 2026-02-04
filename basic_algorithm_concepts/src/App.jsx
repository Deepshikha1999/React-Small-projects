import { useState } from 'react';
import './App.css';
import algo_helper from './data/mapper';

function App() {

  const [selectedAlgo, setSelectedAlgo] = useState("Pallindrome");

  const AlgoComponent = selectedAlgo ? algo_helper[selectedAlgo].component : null;

  return (
    <div className='App'>
      <div className='Header'><h1>Algorithm</h1></div>
      <div className="List">
        <ul>
          {
            Object.keys(algo_helper).map(key =>
              <li key={key}
                onClick={() => {
                  setSelectedAlgo(key)
                }}
                style = {{
                  backgroundColor: selectedAlgo===key && "crimson",
                }}
              >
                {algo_helper[key].name}
              </li>)
          }
        </ul>
      </div>
      <div className="Main">
        {!selectedAlgo && <h1> Select the Algorithm </h1>}
        { selectedAlgo && <AlgoComponent/>}
      </div>
    </div>
  )
}

export default App
