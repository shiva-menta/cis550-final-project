import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import spotifyIdToJSON from "../utils";
import SongCard from "../components/SongCard";
import QuoteCard from "../components/QuoteCard";

import ApiInfo from '../config.json'

// Spotify ID Imports
const CLIENT_ID = ApiInfo['CLIENT_ID'];
const CLIENT_SECRET = ApiInfo['CLIENT_SECRET'];

function CreatorPage() {
    const { name, type } = useParams();
    const [pieces, setPieces] = useState([]);
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        let accessToken = [];
        const getData = async () => {
            if (type === "author") {
                const res = await fetch(`http://localhost:8080/authors/${name}`);
                const data = await res.json();
                setUserInfo(data[0]);

                const works = await fetch(`http://localhost:8080/author_quotes/${name}`);
                const works_data = await works.json();
                setPieces(works_data);
            } else {
                const res = await fetch(`http://localhost:8080/artists/${name}`);
                const data = await res.json();
                setUserInfo(data[0]);

                const works = await fetch(`http://localhost:8080/artist_songs/${name}`);
                const works_data = await works.json();
                const newData = await Promise.all(works_data.map(async (item) => {
                    const { link, image } = await spotifyIdToJSON(item.spotifyId, accessToken);
                    return {
                        ...item,
                        link,
                        image,
                    };
                }));
                setPieces(newData);
            }
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
            .then(getData())
    }, []);

    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8 text-white">
            <h1>{name}</h1>
            <div className="rounded-lg shadow-md bg-gray-300 text-black px-8 py-4">
                <h3>Overall Statistics</h3>
                <div className="flex gap-8">
                    <div>
                        <div className="font-bold">Closest Word</div>
                        <div>{userInfo.closest_word}</div>
                    </div>
                    <div>
                        <div className="font-bold">Average Valence</div>
                        <div>{userInfo.avg_val}</div>
                    </div>
                    <div>
                        <div className="font-bold">Average Arousal</div>
                        <div>{userInfo.avg_ars}</div>
                    </div>
                    <div>
                        <div className="font-bold">Average Dominance</div>
                        <div>{userInfo.avg_dom}</div>
                    </div>
                </div>
            </div>
            {type === "author" ? (
                <div className="w-full">
                    <h3>Quotes</h3>
                    <div className="flex gap-4 items-center overflow-x-auto mt-4">
                        {pieces.map((quote, idx) =>
                            <div className="pb-4">
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
                            <div className="pb-4">
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