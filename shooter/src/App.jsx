import { useEffect, useRef, useState } from 'react'
import './App.css'
import Shooter from './components/Shooter';
import BloodSplatter from './components/BloodSplatter';
import GameScene from './components/GameScene';

function App() {
  const gunRef = useRef(null);
  const [bloodSplatter, setBloodSplatter] = useState([])
  const [countKills,setCountKills] = useState(0)

  useEffect(() => {
    const bloodInterval = setInterval(() => {
      setBloodSplatter((oldBloodPos) => {
        return oldBloodPos
          .map((blood) =>
            blood.timeSpan - 1000 > 0
              ? { ...blood, timeSpan: blood.timeSpan - 1000 }
              : null
          )
          .filter(Boolean);
      });
    }, 1000);

    return () => clearInterval(bloodInterval);
  }, [bloodSplatter]);

  console.log(countKills)
  return (
    <div className="App">
      <GameScene gunShots={bloodSplatter} setCountKills={setCountKills}/>
      <Shooter gunRef={gunRef} setBloodSplatter={setBloodSplatter} />
      {bloodSplatter.length > 0 && bloodSplatter.map((bloobPos, index) => { return <BloodSplatter shotPos={bloobPos} key={index} blood={false}/> }
      )}
    </div>
  )
}

export default App
