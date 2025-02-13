import { useEffect, useState, useRef } from "react";

export default function FibonacciSpiral() {
  const FibonacciSpiralSizeRef = useRef();
  const [dimensions, setDimensions] = useState([0, 0]);

  useEffect(() => {
    if (FibonacciSpiralSizeRef.current) {
      setDimensions([
        FibonacciSpiralSizeRef.current.offsetWidth,
        FibonacciSpiralSizeRef.current.offsetHeight,
      ]);
    }
  }, []);


    const fibseq = 12
    const FibonacciSpiralPixels = Array.from({length:fibseq},(_,i)=><div className="pixel" key={i} style={{ backgroundColor: 'transparent' }}></div>)
    FibonacciSpiralPixels[0] =  (<div
              className="pixel"
              key="0"
              style={{
                backgroundColor: "darkslateblue",
                width: "10px",
                height: "10px",
                borderRadius: "47% 53% 0% 100% / 100% 68% 32% 0%",
                position:"relative",
                top:"100px",
                left:"200px"
              }}
            ></div>
            )
    FibonacciSpiralPixels[1]=(
        <div
              className="pixel"
              key="1"
              style={{
                backgroundColor: "darkslateblue",
                width: "10px",
                height: "10px",
                borderRadius: "0% 100% 0% 100% / 0% 0% 100% 100%",
                position:"relative",
                top: "110px",
                left:"190px"
              }}
            ></div>
    )

    FibonacciSpiralPixels[2]=(
        <div
              className="pixel"
              key="2"
              style={{
                backgroundColor: "darkslateblue",
                width: "20px",
                height: "20px",
                borderRadius: "0% 100% 100% 0% / 0% 0% 100% 100%",
                position:"relative",
                top:"105px",
                left:"190px"
              }}
            ></div>
    )
    FibonacciSpiralPixels[3]=(
        <div
              className="pixel"
              key="3"
              style={{
                backgroundColor: "darkslateblue",
                width: "30px",
                height: "30px",
                borderRadius: "0% 100% 100% 0% / 0% 100% 0% 100%",
                position:"relative",
                top:"80px",
                left:"160px"
              }}
            ></div>
    )
    FibonacciSpiralPixels[4]=(
        <div
              className="pixel"
              key="4"
              style={{
                backgroundColor: "darkslateblue",
                width: "50px",
                height: "50px",
                borderRadius: "100% 0% 0% 100% / 100% 0% 100% 0%",
                position:"relative",
                top:"90px",
                left:"80px"
              }}
            ></div>
    )

    FibonacciSpiralPixels[5]=(
        <div
              className="pixel"
              key="5"
              style={{
                backgroundColor: "darkslateblue",
                width: "80px",
                height: "80px",
                borderRadius: "100% 0% 0% 100% / 0% 0% 100% 100%",
                position:"relative",
                top:"150px",
                left:"30px"
              }}
            ></div>
    )
    FibonacciSpiralPixels[6]=(
        <div
              className="pixel"
              key="6"
              style={{
                backgroundColor: "darkslateblue",
                width: "130px",
                height: "130px",
                borderRadius: "100% 0% 100% 0% / 0% 0% 100% 100% ",
                position:"relative",
                top:"125px",
                left:"20px"
              }}
            ></div>
    )
    FibonacciSpiralPixels[7]=(
        <div
              className="pixel"
              key="7"
              style={{
                backgroundColor: "darkslateblue",
                width: "210px",
                height: "210px",
                borderRadius: "0% 100% 100% 0% / 0% 100% 0% 100%",
                position:"relative",
                bottom:"40px",
                right:"190px"
              }}
            ></div>
    )
    FibonacciSpiralPixels[8]=(
        <div
              className="pixel"
              key="8"
              style={{
                backgroundColor: "darkslateblue",
                width: "340px",
                height: "340px",
                borderRadius: "100% 0% 0% 100% / 100% 0% 100% 0%",
                position:"relative",
                top:"25px",
                right:"740px"
              }}
            ></div>
    )

    FibonacciSpiralPixels[9]=(
        <div
              className="pixel"
              key="9"
              style={{
                backgroundColor: "darkslateblue",
                width: "550px",
                height: "550px",
                borderRadius: "100% 0% 0% 100% / 0% 0% 100% 100%",
                position:"relative",
                top:"470px",
                right:"1080px"
              }}
            ></div>
    )
    FibonacciSpiralPixels[10]=(
        <div
              className="pixel"
              key="10"
              style={{
                backgroundColor: "darkslateblue",
                width: "890px",
                height: "890px",
                borderRadius: "100% 0% 100% 0% / 0% 0% 100% 100%",
                position:"relative",
                top:"300px",
                right:"1080px"
              }}
            ></div>
    )
    FibonacciSpiralPixels[11]=(
        <div
              className="pixel"
              key="11"
              style={{
                backgroundColor: "darkslateblue",
                width: "1440px",
                height: "1440px",
                borderRadius: "0% 100% 100% 0% / 0% 100% 0% 100%",
                position:"relative",
                top:"-865px",
                left:"-2520px"
              }}
            ></div>
    )
  return (
    <div
      ref={FibonacciSpiralSizeRef}
      className="FibonacciSpiral"
    >
      {FibonacciSpiralPixels}
    </div>
  );
}

// FibonacciSpiralPixels[i][j]=<div className="pixel" key={i + "" + j} style={{ backgroundColor: 'darkslateblue' }}></div>
// FibonacciSpiralPixels[i][j]=<div className="pixel" key={i + "" + j} style={{ backgroundColor: 'transparent' }}></div>
// border-radius: 0% 100% 100% 0% / 100% 100% 0% 0% 