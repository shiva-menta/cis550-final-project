// WORLD PAGE

// Involved Queries:
//     Route X (Get Top Song, Quote, and VAD Values for Each Country)

// Imports
import React from "react";
import { useState, useEffect } from "react";

import SongCard from "../components/SongCard";
import QuoteCard from "../components/QuoteCard";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

import { authenticate } from "../api/spotifyInfo";
import { getCountryData } from "../api/wordVADInfo";

// Main Component
function WorldPage() {
    // State Hooks
    const [results, setResults] = useState([]);

    // Effect Hook
    useEffect(() => {
        let accessToken = "";
        authenticate()
            .then(data => {
                accessToken = data.access_token;
                return getCountryData(accessToken);
            })
            .then(data => setResults(data));
    }, []);    

    // Render Function
    return (    
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8">
            <h1 className="text-white mb-4">The World By Emotion</h1>
            <div className="flex flex-row items-center justify-between w-full mb-4">
                <h3 className="text-white w-3/16">Country</h3>
                <h3 className="text-white w-1/4">Quote</h3>
                <h3 className="text-white w-1/4">Song</h3>
                <h3 className="text-white w-5/16">VAD</h3>
            </div>
            <div className="w-full flex w-full flex-col gap-8 overflow-x-hidden">
                {results.map((result, index) => (
                    <div className="flex flex-row items-center w-full" key={index}>
                        <div className="w-3/16 flex justify-center items-center">
                            <h2 className="text-white">{result.country}</h2>
                        </div>
                        <div className="w-1/4 flex justify-center items-center">
                            <QuoteCard quote={result.quote} author={result.author} />
                        </div>
                        <div className="w-1/4 flex justify-center items-center">
                            <SongCard title={result.title} artist={result.artist} image={result.image} link={result.link}/>
                        </div>
                        <div className="w-5/16 flex justify-center items-center">
                            <ResponsiveContainer height={250} width={400}>
                                <RadarChart
                                    data={[
                                        { name: 'Valence', value: result.valence },
                                        { name: 'Arousal', value: result.arousal },
                                        { name: 'Dominance', value: result.dominance },
                                    ]}
                                >
                                    <PolarGrid stroke="#ffffff"/>
                                    <PolarAngleAxis dataKey='name' stroke="#ffffff"/>
                                    <PolarRadiusAxis angle={-30} domain={[0, 10]} stroke="#ffffff"/>
                                    <Radar name='value' dataKey='value' stroke='#f3f3f3' fill='#808080' />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WorldPage;