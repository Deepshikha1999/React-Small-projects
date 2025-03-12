import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay, FaVolumeUp } from "react-icons/fa"
import { getToken } from "../../helper/server";
const Icons = [<FaBackward />, <FaPlay />, <FaPause />, <FaForward />, <FaVolumeUp />]
// "https://open.spotify.com/album/63OVAw3XKXePV928emHvUa"
export default function Radio({ }) {
    // const iframeRef = useRef(null)
    const [token, settoken] = useState(null);
    const [isPaused, setIsPaused] = useState(true);

    useEffect(() => {
        const authCall = async () => {
            const hash = await getToken()
            console.log(hash)
            window.location.hash = ""
            if (hash.Authorization) {
                settoken(hash)
            }
        }
        authCall()
    }, [])

    const playSong = async () => {
        if (!token) return;
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Authorization": `${token.Authorization}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uris: ["spotify:track:0aWMVrwxPNYkKmFthzmpRi"]
            })
        });
        setIsPaused(false)
    }

    const pauseSong = async () => {
        if (!token) return;
        await fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: {
                "Authorization": `${token.Authorization}`
            }
        });
        setIsPaused(true)
    }

    return (
        <div className="RadioBox">
            <div className="Speakers">
                <div className="LeftSpeaker"></div>
                <div className="RightSpeaker"></div>
            </div>
            <div className="AudioVideo">
                <div className="Casette">
                    <div className="boxCase">
                        <div className="casetteRollLeft"></div>
                        <div className="centerBox"></div>
                        <div className="casetteRollRight"></div>
                    </div>
                </div>
                <div className="Controllers">
                    {Icons.map((icon, i) => {
                        if (i == 1) {
                            return <div className="Icon" key={i} onClick={playSong}>{icon}</div>
                        }
                        else if (i == 2) {
                            return <div className="Icon" key={i} onClick={() => { pauseSong }}>{icon}</div>
                        }
                        else
                            return <div className="Icon" key={i}>{icon}</div>
                    })}
                </div>
                <div className="VideoBox">
                      {/* <iframe
                        ref={iframeRef}
                        src="https://open.spotify.com/embed/track/0aWMVrwxPNYkKmFthzmpRi"
                        allow="encrypted-media"
                    >
                    </iframe> */}
                    <p style={{ textAlign: "center", color: "white" }}>{"Song Name"}</p>
                </div>
            </div>
        </div>
    )
}