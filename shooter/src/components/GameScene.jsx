import { useEffect, useState } from 'react';
import M1 from '../assets/Monsters/Monster1.png';
import M2 from '../assets/Monsters/Monster2.png';
import M3 from '../assets/Monsters/Monster3.png';
import M4 from '../assets/Monsters/Monster4.png';
import M5 from '../assets/Monsters/Monster5.png';
import M6 from '../assets/Monsters/Monster6.png';
// import Samurai from '../assets/Samurai1.gif';
import Monster from './Monster';

const MONSTER_IMG = [M2, M3, M4, M5];
const NumberOfMonsters = 20;
const MONSTER_SIZE = 100; // Approximate width & height of each monster

export default function GameScene({ gunShots, setCountKills }) {
    const [monsterPos, setMonsterPos] = useState([]);

    useEffect(() => {
        const appElement = document.querySelector(".App");
        if (!appElement) return;

        const appRect = appElement.getBoundingClientRect();
        const appWidth = appRect.width;
        const appHeight = appRect.height;

        const newMonsters = [];

        function isOverlapping(newX, newY) {
            return newMonsters.some(monster => {
                const dx = monster.x - newX;
                const dy = monster.y - newY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < MONSTER_SIZE; // Ensures monsters don’t overlap
            });
        }

        for (let i = 0; i < NumberOfMonsters; i++) {
            let x, y;
            let attempts = 0;
            do {
                x = Math.random() * (appWidth - MONSTER_SIZE);
                y = Math.random() * (appHeight - MONSTER_SIZE);
                attempts++;
                if (attempts > 1000) break; // Avoid infinite loops in edge cases
            } while (isOverlapping(x, y));

            newMonsters.push({
                x,
                y,
                img: MONSTER_IMG[Math.floor(Math.random() * MONSTER_IMG.length)],
                isDead:false
            });
        }

        setMonsterPos(newMonsters);
    }, []);

    return (
        <>
            {monsterPos.map((item, index) => {
                const monster = <Monster
                gunShots={gunShots}
                setCountKills={setCountKills}
                mpos={item}
                key={index}
                setMonster={setMonsterPos} 
                index={index}
            />
            return !item.isDead && monster
            })}
        </>
    );
}
