import './App.css';
import Header from './Components/Header/Header.js';
import CoreConceptsDetails from './Components/CoreConceptsDetails';
import Examples from './Components/Examples';

function App() {
  return (
    // <div>
    <fragment className="App">
      <Header />
      <main>
        <CoreConceptsDetails />
        <Examples />
      </main>
      {/* </div> */}
    </fragment>
    // other alternative if no class or id is defined we can wrap the elements inside <></>
  );
}

export default App;
