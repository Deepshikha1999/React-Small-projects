import { useEffect, useRef, useState } from 'react';
import './App.css';
import list from './misc/List';
import BackFunction from './components/BackFunction';

function App() {

  const [selectedPage, setSelectedPage] = useState("MakeYourOwnCard");

  return (
    <div className="App">
      {!selectedPage && <div className='List'>
        {Object.keys(list).map((val, index) => {
          return <div className="bubble" key={index} onClick={() => setSelectedPage(val)}>{list[val].name}</div>
        })}
      </div>
      }
      {selectedPage && list[selectedPage].component}
      <BackFunction setSelectedPage={setSelectedPage} />
    </div>
  )
}

export default App
