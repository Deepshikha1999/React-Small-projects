import './App.css';
import calculator from './Assets/calculator';
import Header from './Components/Header';
import Input from './Components/Input';
import { useState } from 'react';
import OutputTable from './Components/OutputTable';

function App() {
  const [input, setInput] = useState({
      initial: 10000,
      annual: 100,
      return: 5,
      duration: 1
  })

  return (
    <div className="App">
      <Header />
      <Input setInput={setInput} input={input} />
      <OutputTable records = {calculator(input)}/>
    </div>
  );
}

export default App;
