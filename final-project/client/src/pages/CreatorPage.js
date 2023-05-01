// CREATOR PAGE

// Involved Queries:
//     Route X (Get Author Average Information)
//     Route Y (Get Artist Average Information)
//     Route Z (Get All An Author's Quotes)
//     Route A (Get All An Artist's Songs)

// Imports
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SongCard from "../components/SongCard";
import QuoteCard from "../components/QuoteCard";

import { authenticate } from "../api/spotifyInfo";
import { getAuthor, getAuthorQuotes, getArtist, getArtistSongs } from "../api/wordVADInfo";

// Main Component
function CreatorPage() {
    // State Hooks
    const { name, type } = useParams();
    const [pieces, setPieces] = useState([]);
    const [userInfo, setUserInfo] = useState([]);

    // Effect Hook
    useEffect(() => {
        let accessToken = [];
        const getData = async () => {
            if (type === "author") {
                getAuthor(name)
                    .then(data => setUserInfo(data[0]));
                getAuthorQuotes(name)
                    .then(data => setPieces(data));
            } else {
                getArtist(name)
                    .then(data => setUserInfo(data[0]));
                getArtistSongs(name, accessToken)
                    .then(data => setPieces(data));
            }
        }

        authenticate()
            .then(data => accessToken = data.access_token)
            .then(getData());
    }, []);

    // Constants
    const statisticsDefaults = [
        { name: "Closest Word", value: userInfo.closest_word },
        { name: "Average Valence", value: userInfo.avg_val },
        { name: "Average Arousal", value: userInfo.avg_ars },
        { name: "Average Dominance", value: userInfo.avg_dom },
    ]

    // Main Component
    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8 text-white">
            <h1>{name}</h1>
            <div className="rounded-lg shadow-md bg-gray-300 text-black px-8 py-4">
                <h3>Overall Statistics</h3>
                <div className="flex gap-8">
                    {statisticsDefaults.map((statistic, idx) =>(
                        <div key={idx}>
                            <div className="font-bold">{statistic.name}</div>
                            <div>{statistic.value}</div>
                        </div>
                    ))}
                </div>
            </div>
            {type === "author" ? (
                <div className="w-full">
                    <h3>Quotes</h3>
                    <div className="flex gap-4 items-center overflow-x-auto mt-4">
                        {pieces.map((quote, idx) =>
                            <div className="pb-4" key={idx}>
                                <QuoteCard key={`quote_${idx}`} quote={quote.quote} author={quote.author} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <h3>Songs</h3>
                    <div className="flex gap-4 items-center overflow-x-auto mt-4">
                        {pieces.map((song, idx) => 
                            <div className="pb-4" key={idx}>
                                <SongCard key={`song_${idx}`} title={song.title} artist={song.artist} image={song.image} link={song.link}/>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default CreatorPage;