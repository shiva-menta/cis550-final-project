import React from "react";
import { useState, useEffect } from "react";

function WorldPage() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const getCountryInfo = async () => {
            const res = await fetch(`http://localhost:8080/country_songs_and_quotes`);
            const data = await res.json();
            setResults(data);
        }
        getCountryInfo();
    }, []);

    return (    
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8">
            <h1 className="text-white">The World By Emotion</h1>
            
        </div>
    );
}

export default WorldPage;