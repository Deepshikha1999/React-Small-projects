import { useEffect, useRef, useState } from "react";
import BloodSplatter from "./BloodSplatter";

export default function Monster({ gunShots, setCountKills, mpos, setMonster, index }) {
    const mRef = useRef(null);
    const [monsterPos, setMonsterPos] = useState({
        top: mpos.y,
        left: mpos.x,
        width: 80, // Default size if getBoundingClientRect() fails
        height: 80
    });
    const [isDead, setIsDead] = useState(false);
    const [countDown, setCountDown] = useState(2000)
    // Compute monster's position once, when it mounts or when its position changes
    useEffect(() => {
        if (mRef.current) {
            setTimeout(() => {
                const { top, left, width, height } = mRef.current.getBoundingClientRect();
                setMonsterPos({ top, left, width, height });
            }, 50);
        }
    }, [mpos]);

    useEffect(() => {
        if (!isDead || countDown <= 0) return;

        const bloodInterval = setInterval(() => {
            setCountDown((prevCount) => {
                if (prevCount <= 500) {
                    clearInterval(bloodInterval);
                    return 0;
                }
                return prevCount - 500;
            });
            if(countDown==0){
                setMonster((allMonsterPos)=>{
                    let newMonsterPos = [...allMonsterPos]
                    newMonsterPos[index].isDead = true  
                    return newMonsterPos
                })
            }
        }, 500);

        // Cleanup interval when component unmounts or countdown reaches 0
        return () => clearInterval(bloodInterval);
    }, [isDead, countDown]);

    useEffect(() => {
        // If there are no gunshots, return early
        if (!gunShots || gunShots.length === 0 || !monsterPos) return;

        const latestShot = gunShots[gunShots.length - 1];
        const { left: gx, top: gy } = latestShot;
        if (
            gx >= monsterPos.left &&
            gx <= monsterPos.left + monsterPos.width / 2 &&
            gy >= monsterPos.top &&
            gy <= monsterPos.top + monsterPos.height / 2
        ) {
            console.log("Monster hit!");
            setIsDead(true);
            setCountKills((oldCount) => oldCount + 1)
        }
    }, [gunShots, monsterPos]);

    return (
        <>
            {!isDead && monsterPos && <div ref={mRef} className="Monster" id="Monster" style={{
                position: "absolute",
                top: `${mpos.y}px`,
                left: `${mpos.x}px`,
                backgroundImage: `url(${mpos.img})`,
                backgroundBlendMode:"luminosity"
            }}></div>}
            {isDead && countDown && <BloodSplatter shotPos={monsterPos} blood={true} />}
        </>
    );
}


// const mRefElement = mRef.current;
// const [top,left,width,height] = [mRefElement.offsetTop,mRefElement.offsetLeft,mRefElement.offsetWidth,mRefElement.offsetHeight]
//   setMonsterPos({ top:top, left:left, width:width, height:height });