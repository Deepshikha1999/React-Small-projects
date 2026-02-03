import { useEffect, useRef, useState } from "react";
import "./../styles/HashingLookUp.css";
import questMap from "../data/QuestMapper";
const URL = import.meta.env.VITE_LOCAL_URL ? import.meta.env.VITE_LOCAL_URL : "https://basicalgo-api.onrender.com";

const fetchARandomWord = async () => {
    try {
        const res = await fetch(URL + "/api/word");
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.log(err)
        return []
    }
};

const KEYS = Object.keys(questMap);

export default function HashingLookUp({ }) {
    const [message, setMessage] = useState("Treasure Hunt");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [pageSize, setPageSize] = useState(null);
    const [inputPassword, setInputPassword] = useState("");
    const [currentPage, setCurrentPage] = useState(null);
    const [start, setStart] = useState(false);
    const [pin, setPin] = useState(null);
    const imagesRef = useRef({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [randomWord, setRandomWord] = useState(null);

    useEffect(() => {
        if (currentPage === null) return;

        // 1. Reset loading state for the new page
        setIsLoaded(false);

        const URLS = questMap[KEYS[parseInt(currentPage)]].imagesUrl;
        const entries = Object.entries(URLS);
        if (entries.length === 0) {
            setIsLoaded(true);
            return;
        }

        let countLoad = 0;
        const handleLoads = () => {
            countLoad++;
            if (countLoad === entries.length) setIsLoaded(true);
        };

        for (let [key, url] of entries) {
            const img = new Image();
            img.src = url;
            img.onload = handleLoads;
            imagesRef.current[key] = img;
        }
    }, [currentPage]);


    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchARandomWord();
                console.log(data)
                setRandomWord(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadData();
    }, [])



    useEffect(() => {
        if (!start) return;
        setCurrentPage(0 + "");
    }, [start])

    useEffect(() => {
        const updatePageSize = () => {
            const divClass = document.getElementById("hashing_board");
            setPageSize({
                width: divClass.clientWidth,
                height: divClass.clientHeight
            })
        }

        updatePageSize()
        window.addEventListener("resize", updatePageSize);
        return () => {
            window.removeEventListener("resize", updatePageSize);
        }
    }, [])

    useEffect(() => {
        if (!pageSize || !isLoaded || !currentPage) return;
        console.log(questMap[KEYS[parseInt(currentPage)]])
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const { width, height } = pageSize;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const page = questMap[KEYS[parseInt(currentPage)]];
        console.log(page)
        page.drawPages(ctx, width, height, page, imagesRef, randomWord);
        setPin(page.key);
        setMessage(page.hint)

    }, [pageSize, currentPage, isLoaded, randomWord])

    const handleCheck = () => {
        if (!currentPage || !inputPassword) return;
        if (questMap[KEYS[parseInt(currentPage)]].check(inputPassword, randomWord))
            setCurrentPage(prev => parseInt(prev) == KEYS.length - 1 ? 0 + "" : (parseInt(prev) + 1) + "")
    }



    return (
        <div className="HashingLookUp">
            <h1 className="Title">Hashing, Treasure hunting</h1>
            <div className="Message">{message}</div>
            <div className="InputPanel">
                <input type="text" value={inputPassword} placeholder="password" onChange={(e) => setInputPassword(e.target.value)} />
                <button onClick={handleCheck}>Done</button>
                <button onClick={() => setStart(true)}>START</button>
            </div>
            <div className="Board" id="hashing_board">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    )
}