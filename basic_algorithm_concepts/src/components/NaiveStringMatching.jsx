import "./../styles/NaiveStringMatching.css";
import kiki from "./../assets/1356532.png";
import { useEffect, useRef, useState } from "react";

const DEFAULT_VALUE = {
    name: "DCS World Steam Edition",
    about_game: `About This GameFeel the excitement of flying the Su-25T "Frogfoot" attack jet and the TF-51D "Mustang" in the free-to-play Digital Combat Simulator World! Two free maps are also included: The eastern Black Sea and the Mariana Islands.Digital Combat Simulator WorldDigital Combat Simulator World (DCS World) is a free-to-play digital battlefield game.Our dream is to offer the most authentic simulation of military aircraft, ground and armor vehicles, and naval units possible. This free download includes a vast area of the Caucasus region as well as a free Mariana Islands map. It includes one of the most powerful Mission Editors ever designed, network play, and hundreds of AI weapons systems, ground units, armored vehicles, air defense systems, and ships. It also includes a free Russian Sukhoi Su-25T ground attack jet and the famous WWII North American TF-51D Mustang fighter. DCS is a true "sandbox" simulation that is also designed to cover multiple time periods of interest such as WWII, Korean War, Vietnam, Gulf War and others. Current regions to battle include the Black Sea, Marianas, Nevada Test and Training Range, Persian Gulf, English Channel, Syria, and Normandy 1944. DCS World is a deep and realistic simulation that can be tailored to suit any level of experience. Our mission is to deliver excellence and make your dreams a virtual reality. We do this by offering training for complex weapons systems like the DCS: F/A-18C Hornet, DCS: F-16C Viper, DCS: AH-64D, and many more. The next step is the real thing!KEY FEATURESA realistic Free-to-Play digital battlefield.Eagle Dynamics Graphics Engine (EDGE) that looks amazing from 0 to 80,000 feet.Free American TF-51 Mustang and Russian Su-25T attack jet.Multi-layer volumetric cloudscapes with wind, precipitation, air pressure, and more.Highly detailed map of the Caucasus region that encompass southwestern Russia and Georgia. 20 operational airbases, detailed terrain, and both civil and military infrastructure with thousands of kilometers of usable roads and railway.Detailed recreation of the Mariana Islands including 1,500 x 1,000km of land and ocean for naval operations that includes Andersen AFB and the airfields on Rota, Tinian and Saipan.Includes hundreds of fully operational weapons systems, ground vehicles, ships and AI-controlled aircraft.The Mission Editor allows rapid mission generation and the possibility to create your own missions and campaigns for unlimited gameplay.Multi-Crew enables full network play in the same aircraft in Multiplayer.Thousands of online servers offering PvP and PvE.Mouse interactive 6 degrees of Freedom (6DOF) cockpitsAccurate flight models, weapons systems, sensors, targeting systems and sounds.Hundreds of missions and campaigns with new campaigns continually created.Community Files section offering endless user created modifications, skins, missions and more.Full virtual reality support.`
}

const fetchGameDetails = async () => {
    try {
        const res = await fetch("http://localhost:5001/api/gameDetails");
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.log(err)
        return []
    }

};

const fetchGameDescription = async (id) => {
    try {
        const res = await fetch(`http://localhost:5001/api/game/${id}`);
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.log(err)
        return []
    }
}

export default function NaiveStringMatching({ }) {

    const [searchWord, setSearchWord] = useState("");
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState(false);
    const [gameDetails, setGameDetails] = useState([]);
    const [randomId, setRandomId] = useState(null);
    const [gameDes, setGameDes] = useState(null);
    const [textIndex, setTextIndex] = useState(0);
    const [matchIndices, setMatchIndices] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchGameDetails();
                setGameDetails(data);
            } catch (err) {
                console.error(err);
                setMessage("Failed to load game details");
            }
        };

        loadData();
    }, [])

    const handleRandomId = () => {
        if (!gameDetails || gameDetails.length == 0) return;
        const n = gameDetails.length;
        const x = Math.floor(Math.random() * n)
        setRandomId(gameDetails[x])
    }


    useEffect(() => {
        if (!randomId) return;

        const loadData = async () => {
            try {
                const response = await fetchGameDescription(randomId.id);
                if (!response?.data) throw "data not found";
                setGameDes(response.data);
            } catch (err) {
                console.error(err);
                setMessage("Failed to load game Description");
            }
        };

        loadData();
    }, [randomId])

    const startSearch = () => {
        if(!randomId) {
            handleRandomId()
            return;
        }
        setSearch(true);
        setMessage("Searching ...")
        setTextIndex(0)
        setMatchIndices([])
    }

    const stopSearch = () => {
        setSearch(false);
        setMessage("Search Done ...")
    }

    useEffect(() => {
        // Only run if searching is active and we have text
        if (!search || !gameDes?.about_game || !searchWord) return;

        const about = gameDes.about_game;
        const n = about.length;
        const m = searchWord.length;

        // Stop if we reached the end
        if (textIndex > n - m) {
            stopSearch();
            const foundCount = matchIndices.length;
            setMessage(foundCount > 0
                ? `Search Complete: Found ${foundCount} matches!`
                : "No matches found.");
            return;
        }

        const timeout = setTimeout(() => {
            const currentSlice = about.substring(textIndex, textIndex + m).toLowerCase();
            const pattern = searchWord.toLowerCase();

            if (currentSlice === pattern) {
                setMatchIndices(prev => [...prev, textIndex]);
                // Slide by pattern length to skip the word we just found
                setTextIndex(prev => prev + m);
            } else {
                // Slide by 1 to check the next possible start position
                setTextIndex(prev => prev + 1);
            }
        }, 5); // Adjust this number to change search speed

        return () => clearTimeout(timeout);
    }, [search, textIndex, gameDes, searchWord]);

    return (
        <div className="NaiveStringMatching">
            <h1 className="Title">Naive String Matching</h1>
            <div className="InputPanel">
                <label> Search word</label>
                <input
                    type="text"
                    name="word"
                    value={searchWord}
                    onChange={(e) => { setSearchWord(e.target.value) }}
                    disabled={search}
                />
                <button onClick={startSearch} disabled={search}>Search</button>
                <button onClick={stopSearch} disabled={!search} style={{ backgroundColor: "crimson" }}>Stop Search</button>
                <button onClick = {()=>{handleRandomId()}} style={{ backgroundColor: "orange", color: "black" }} disabled={search}> Generate Text </button>
            </div>
            <div className="Message">{message}</div>
            {gameDes &&
                <div className="glass-card" >
                    <h2 className="card-title">{gameDes.name}</h2>
                    <p className="card-text">
                        {/* {gameDes.about_game} */}
                        {gameDes.about_game.split("").map((char, i) => {
                            let color = "inherit";
                            let backgroundColor = "transparent";

                            // Highlight the current "sliding window"
                            if (i >= textIndex && i < textIndex + searchWord.length) {
                                backgroundColor = "rgba(255, 255, 0, 0.5)"; // Yellow window
                            }

                            // Highlight permanent matches found
                            const isMatched = matchIndices.some(start => i >= start && i < start + searchWord.length);
                            if (isMatched) {
                                backgroundColor = "#2ecc71"; // Green match
                                color = "white";
                            }

                            return (
                                <span key={i} style={{ backgroundColor, color }}>
                                    {char}
                                </span>
                            );
                        })}
                    </p>
                </div>
            }
        </div>
    )
}

//  style={{backgroundImage: `url(${randomId.img})`}}