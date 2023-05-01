// MOOD JOURNEY PAGE

// Involved Queries:
//     Route Z (Get Mood Shift Playlist)

// Imports
import { useState, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import TypeInDropdown from "../components/TypeInDropdown";
import SongCard from "../components/SongCard";

import { getAllWords, getPlaylists } from "../api/wordVADInfo";
import { authenticate } from "../api/spotifyInfo";

// Main Component
function MoodJourneyPage({ color }) {
    // Constants
    const threshold = 1;
    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };

    // State Hooks
    const [startWord, setStartWord] = useState("");
    const [endWord, setEndWord] = useState("");

    const [accessToken, setAccessToken] = useState("");
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [playlistResults, setPlaylistResults] = useState([]);

    // Effect Hook
    useEffect(() => {
        getAllWords()
            .then(data => setSearchResults(data));
        authenticate()
            .then(data => setAccessToken(data));
    }, []);

    // getPageContent Function
    const getPageContent = async () => {
        if (startWord === "" || endWord === "") {
            alert("Please fill in both fields.");
            return;
        }

        getPlaylists(startWord, endWord, threshold, accessToken)
            .then(data => setPlaylistResults(data))
            .then(() => setShowPlaylist(true));
    }
    
    // Render Function
    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8">
            <h1 className="text-white">Create Mood Journey</h1>
            <div className="w-full">
                <div className="flex flex-row items-center justify-around w-full">
                    <div className="w-1/3">
                        <h4 className="text-white">Current Emotion</h4>
                        <TypeInDropdown onChangeFunc={setStartWord} results={searchResults} defaultText={"Your current emotion in one word..."} />
                    </div>
                    <AiOutlineArrowRight className="text-white icon"/>
                    <div className="w-1/3">
                        <h4 className="text-white">Desired Emotion</h4>
                        <TypeInDropdown onChangeFunc={setEndWord} results={searchResults} defaultText={"Your desired emotion in one word..."} />
                    </div>
                </div>
            </div>
            <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-72 mt-4" style={gradientStyle} onClick={getPageContent}>Make Transition Playlist</button>
            {showPlaylist && (
                <div className="w-full flex flex-col gap-8 mt-4">
                    {playlistResults.map((playlist, index) => (
                        <div className="flex flex-col w-full" key={index}>
                            <h4 className="text-white mb-4">{`Playlist #${index + 1}`}</h4>
                            <div className="w-full flex gap-4 items-center justify-center">
                                <SongCard title={playlist.title1} artist={playlist.artist1} image={playlist.image1} link={playlist.link1}/>
                                <AiOutlineArrowRight className="text-white icon"/>
                                <SongCard title={playlist.title2} artist={playlist.artist2} image={playlist.image2} link={playlist.link2}/>
                                <AiOutlineArrowRight className="text-white icon"/>
                                <SongCard title={playlist.title3} artist={playlist.artist3} image={playlist.image3} link={playlist.link3}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoodJourneyPage;