// CHECK-IN PAGE (MAIN)

// Involved Queries:
//     Route 2 (Get Top Quotes and Songs Given VAD Values)
//     Route Y (Get VAD Values for Valid Word)
//     Route Z (Get All Valid Words)

// Imports
import React from "react";
import { useState, useEffect } from "react";

import './pages.css';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import TypeInDropdown from "../components/TypeInDropdown";
import CustomRangeSlider from "../components/CustomRangeSlider";
import QuoteCard from "../components/QuoteCard";
import SongCard from "../components/SongCard";

import { getAllWords, getWordToVad, getTopQuotesAndSongs } from "../api/wordVADInfo";
import { authenticate } from "../api/spotifyInfo";

// Main Component
function CheckInPage({ color, setColor }) {
    // State Hooks
    const [valence, setValence] = useState(0);
    const [arousal, setArousal] = useState(0);
    const [dominance, setDominance] = useState(0);
    const [selectedWord, setSelectedWord] = useState('');

    const [inputSettings, setInputSettings] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [accessToken, setAccessToken] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedQuotes, setSelectedQuotes] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);

    // Effect Hook
    useEffect(() => {
        getAllWords()
            .then(data => setSearchResults(data));
        authenticate()
            .then(data => setAccessToken(data));
    }, []);

    // Constants
    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };
    const radios = [
        { name: 'Words', value: true },
        { name: 'Sliders', value: false }
    ];
    const sliders = [
        { name: 'Valence', value: valence, onChange: setValence, leftLabel: 'Negative', rightLabel: 'Positive' },
        { name: 'Arousal', value: arousal, onChange: setArousal, leftLabel: 'Low Energy', rightLabel: 'High Energy' },
        { name: 'Dominance', value: dominance, onChange: setDominance, leftLabel: 'Powerless', rightLabel: 'Powerful' },
    ];

    // Get Personalized Results Function
    function vadToHue(valence, arousal, dominance) {
        const normalizedValence = (valence / 10 - 0.5) * 2;
        const normalizedArousal = (arousal / 10 - 0.5) * 2;
        const normalizedDominance = (dominance / 10 - 0.5) * 2;
      
        const weightedSum = (0.6 * normalizedValence) + (0.3 * normalizedArousal) + (0.1 * normalizedDominance);
      
        const hue = ((weightedSum + 1) / 2) * 360;
        return hue;
    }      
    const getPersonalizedResults = async () => {
        let tempValence = valence;
        let tempArousal = arousal;
        let tempDominance = dominance;

        // Get content from VAD values
        const getTopContent = async () => {
            getTopQuotesAndSongs(tempValence, tempArousal, tempDominance, accessToken)
                .then(data => {
                    setSelectedQuotes(data.quotes);
                    setSelectedSongs(data.songs);
                    setShowResults(true);
                });
        };

        // If in words mode, get VAD values for selected word
        if (inputSettings) {
            if (selectedWord === '') {
                alert('Please select a word');
                return;
            }

            getWordToVad(selectedWord)
                .then(data => {
                    tempValence = data[0].valence;
                    tempArousal = data[0].arousal;
                    tempDominance = data[0].dominance;
                })
                .then(() => getTopContent());
        } else {
            getTopContent();
        }
        setColor(vadToHue(tempValence, tempArousal, tempDominance));
    }

    // Render Function
    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8">
            {showResults && (
                <>
                    <h1 className="text-white">Your Results</h1>
                    <div className="w-full">
                        <h2 className="text-white">Top Quotes</h2>
                        <div className="flex gap-4 items-center overflow-x-auto mt-4">
                            {selectedQuotes.map((quote, idx) =>
                                <div className="pb-4" key={idx}>
                                    <QuoteCard key={`quote_${idx}`} quote={quote.quote} author={quote.author} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-white mt-8">Top Songs</h2>
                        <div className="flex gap-4 items-center overflow-x-auto mt-4">
                            {selectedSongs.map((song, idx) => 
                                <div className="pb-4" key={idx}>
                                    <SongCard key={`song_${idx}`} title={song.title} artist={song.artist} image={song.image} link={song.link}/>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {!showResults && (
                <>
                    <h1 className="text-white">How Are You Feeling Today?</h1>
                    {inputSettings && (
                        <div className="text-left w-full h-80">
                            <h2 className="text-white">Describe In Words</h2>
                            <TypeInDropdown onChangeFunc={setSelectedWord} results={searchResults} defaultText={"Your current mood..."} />
                        </div>
                    )}
                    {!inputSettings && (
                        <div className="text-left w-full h-80 flex flex-col gap-4">
                            <h2 className="text-white">Describe In Numbers</h2>
                            {sliders.map((slider, idx) => (
                                <div className="flex items-center justify-between" key={idx}>
                                    <h4 className="text-white w-40">{slider.name}</h4>
                                    <CustomRangeSlider
                                        className="w-full"
                                        min={0}
                                        max={10}
                                        value={slider.value}
                                        onChange={(newValue) => slider.onChange(newValue)}
                                        leftLabel={slider.leftLabel}
                                        rightLabel={slider.rightLabel}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <ButtonGroup className="w-48 mt-8">
                        {radios.map((radio, idx) => (
                            <ToggleButton
                                variant={inputSettings === radio.value ? "custom-black" : "secondary"}
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                name="radio"
                                value={radio.value}
                                checked={inputSettings === radio.value}
                                onChange={(e) => setInputSettings(e.currentTarget.value === 'true')}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                    <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-96" style={gradientStyle} onClick={getPersonalizedResults}>Capture the Moment</button>
                </>
            )}
            
        </div>
    );
}

export default CheckInPage;