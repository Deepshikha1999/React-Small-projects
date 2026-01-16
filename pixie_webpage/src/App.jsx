import './App.css'
import Sheet1 from './components/Sheet1'
import Sheet10 from './components/Sheet10'
import Sheet11 from './components/Sheet11'
import Sheet12 from './components/Sheet12'
import Sheet2 from './components/Sheet2'
import Sheet3 from './components/Sheet3'
import Sheet4 from './components/Sheet4'
import Sheet5 from './components/Sheet5'
import Sheet6 from './components/Sheet6'
import Sheet7 from './components/Sheet7'
import Sheet8 from './components/Sheet8'
import Sheet9 from './components/Sheet9'
import BallCollision from './components/BallCollision'
import BallShower from './components/BallShower'
import BlurOnHover from './components/BlurOnHover'
import BouncingInsideTheScreenBall from './components/BouncingInsideTheScreenBall'
import BoxesAndCircleMatrix from './components/BoxesAndCircleMatrix'
import BoxMotion from './components/BoxMotion'
import BubbleEffect from './components/BubbleEffect'
import CirclePattern from './components/CirclePattern'
import Circles from './components/Circles'
import ClickSpark from './components/ClickSpark'
import ClipImage from './components/ClipImage'
import ClippingImageIntoRect from './components/ClippingImageIntoRect'
import Clock from './components/Clock'
import ClockBasedOnGradientColor from './components/ClockBasedOnGradientColor'
import CloudOnClick from './components/CloudOnClick'
import ColorBallsFountain from './components/ColorBallsFountain'
import Constellation from './components/Constellation'
import EcllipsePattern from './components/EcllipsePattern'
import MetaBalls from './components/MetaBalls'
import MouseGravity from './components/MouseGravity'
import MultipleBouncingBall from './components/MultipleBouncingBall'
import Nanogon from './components/Nanogon'
import Orbit from './components/Orbit'
import Pendulum from './components/Pendulum'
import PixelTrail from './components/PixelTrail'
import RandomSelectionBox from './components/RandomSelectionBox'
import RotatingOrbit from './components/RotatingOrbit'
import Rotation from './components/Rotation'
import Sand from './components/Sand'
import ScarySmiley from './components/ScarySmiley'
import SelfThrustBouncingBall from './components/SelfThrustBouncingBall'
import ShadowCastCanvas from './components/ShadowCastCanvas'
import Shrink_Stretch_Wave_particles from './components/Shrink_Stretch_Wave_particles'
import SineFunction from './components/SineFunction'
import SmokeEffect from './components/SmokeEffect'
import SnakeAndFood from './components/SnakeAndFood'
import SniperPointer from './components/SniperPointer'
import Spiral from './components/Spiral'
import TanFunction from './components/TanFunction'
import TetroMino from './components/TetroMino'
import VSCodeModuleStyle from './components/VSCodeModuleStyle'
import { useState } from 'react'

const METHODS = [
  <Sheet1 />,
  <Sheet2 />,
  <Sheet3 />,
  <Sheet4 />,
  <Sheet5 />,
  <Sheet6 />,
  <Sheet7 />,
  <Sheet8 />,
  <Sheet9 />,
  <Sheet10 />,
  <Sheet11 />,
  <Sheet12 />,
  <BallCollision />,
  <BallShower />,
  <BlurOnHover />,
  <BouncingInsideTheScreenBall />,
  <BoxesAndCircleMatrix />,
  <BoxMotion />,
  <BubbleEffect />,
  <CirclePattern />,
  <Circles />,
  <ClickSpark />,
  <ClipImage />,
  <ClippingImageIntoRect />,
  <Clock />,
  <ClockBasedOnGradientColor />,
  <CloudOnClick />,
  <ColorBallsFountain />,
  <Constellation />,
  <EcllipsePattern />,
  <MetaBalls />,
  <MouseGravity />,
  <MultipleBouncingBall />,
  <Nanogon />,
  <Orbit />,
  <Pendulum />,
  <PixelTrail />,
  <RandomSelectionBox />,
  <RotatingOrbit />,
  <Rotation />,
  <Sand />,
  <ScarySmiley />,
  <SelfThrustBouncingBall />,
  <ShadowCastCanvas />,
  <Shrink_Stretch_Wave_particles />,
  <SineFunction />,
  <SmokeEffect />,
  <SnakeAndFood />,
  <SniperPointer />,
  <Spiral />,
  <TanFunction />,
  <TetroMino />,
  <VSCodeModuleStyle />

]

function App() {
  const [page, setPageNumber] = useState(0)
  const handlePrevPage = () => {
    setPageNumber(oldNum => {
      if (oldNum === 0) {
        return METHODS.length - 1;
      }
      return oldNum - 1;
    })
  }

  const handleNextPage = () => {
    setPageNumber(oldNum => {
      if (oldNum === METHODS.length - 1) {
        return 0;
      }
      return oldNum + 1;
    })
  }

  return (
    <div className="App">
      {METHODS[page]}
      <div className = "Header"><h1>RIDICULOUS</h1></div>
      <div className="nav-container">
        <div className="nav" id="leftbutton" onClick={handlePrevPage}>PREV</div>
        <div className="nav" id="List">{page}</div>
        <div className="nav" id="rightbutton" onClick={handleNextPage}>NEXT</div>
      </div>
    </div>
  )
}

export default App;
