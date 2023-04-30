import React from "react";
import { useState, useEffect } from "react";
import SongCard from "../components/SongCard";
import QuoteCard from "../components/QuoteCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import ApiInfo from '../config.json'
import spotifyIdToJSON from "../utils";

// Spotify ID Imports
const CLIENT_ID = ApiInfo['CLIENT_ID'];
const CLIENT_SECRET = ApiInfo['CLIENT_SECRET'];

function WorldPage() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        let accessToken = "";
        const getCountryInfo = async () => {
            const res = await fetch(`http://localhost:8080/country_songs_and_quotes`);
            const data = await res.json();
            const newData = await Promise.all(data.map(async (item) => {
                const { link, image } = await spotifyIdToJSON(item.spotifyId, accessToken);
                return {
                    ...item,
                    link,
                    image,
                };
            }));
            setResults(newData);
        }
        var authParameters = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
          }
        fetch('https://accounts.spotify.com/api/token', authParameters) 
            .then(result => result.json())
            .then(data => accessToken = data.access_token)
            .then(getCountryInfo())     
    }, []);

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