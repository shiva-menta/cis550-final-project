import React from "react";
import { useState, useEffect } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Downshift from 'downshift';
import './pages.css';
import CustomRangeSlider from "../components/CustomRangeSlider";

import QuoteCard from "../components/QuoteCard";
import SongCard from "../components/SongCard";

import ApiInfo from '../config.json'
import spotifyIdToJSON from "../utils";

// Spotify ID Imports
const CLIENT_ID = ApiInfo['CLIENT_ID'];
const CLIENT_SECRET = ApiInfo['CLIENT_SECRET'];

// top quotes and songs
// top word

function CheckInPage(props) {
    const color = props.color;

    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };

    const [inputSettings, setInputSettings] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [selectedWord, setSelectedWord] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [selectedQuotes, setSelectedQuotes] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);

    const [valence, setValence] = useState(0);
    const [arousal, setArousal] = useState(0);
    const [dominance, setDominance] = useState(0);

    const radios = [
        { name: 'Words', value: true },
        { name: 'Sliders', value: false }
    ]

    useEffect(() => {
        const search = async () => {
            const res = await fetch(`http://localhost:8080/words`);
            const data = await res.json();
            setSearchResults(data);
        }
        search();

        var authParameters = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
          }
        fetch('https://accounts.spotify.com/api/token', authParameters) 
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token)) 
    }, []);

    const getPersonalizedResults = async () => {
        let tempValence = valence;
        let tempArousal = arousal;
        let tempDominance = dominance;

        if (inputSettings) {
            if (selectedWord === '') {
                alert('Please select a word');
                return;
            }
            const res = await fetch(`http://localhost:8080/word_to_vad/${selectedWord}`);
            const data = await res.json();
            
            tempValence = data[0].valence;
            tempArousal = data[0].arousal;
            tempDominance = data[0].dominance;
        }

        const getTopContent = async () => {
            const res = await fetch(`http://localhost:8080/quotes_and_songs/${tempValence}/${tempArousal}/${tempDominance}`);
            const data = await res.json();
            const newData = await Promise.all(data.songs.map(async (item) => {
                const { link, image } = await spotifyIdToJSON(item.spotifyId, accessToken);
                return {
                    ...item,
                    link,
                    image,
                };
            }));
            
            setSelectedQuotes(data.quotes);
            setSelectedSongs(newData);
        }
        getTopContent();
        setShowResults(true);
    }

    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8">
            {showResults && (
                <>
                    <h1 className="text-white">Your Results</h1>
                    <div className="w-full">
                        <h2 className="text-white">Top Quotes</h2>
                        <div className="flex gap-4 items-center overflow-x-auto mt-4">
                            {selectedQuotes.map((quote, idx) =>
                                <div className="pb-4">
                                    <QuoteCard key={`quote_${idx}`} quote={quote.quote} author={quote.author} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-white mt-8">Top Songs</h2>
                        <div className="flex gap-4 items-center overflow-x-auto mt-4">
                            {selectedSongs.map((song, idx) => 
                                <div className="pb-4">
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
                            <Downshift
                                itemToString={(item) => (item ? item : "")}
                                className='z-10'
                                onChange={setSelectedWord}
                            >
                                {({
                                    getInputProps,
                                    getItemProps,
                                    getMenuProps,
                                    isOpen,
                                    inputValue,
                                    highlightedIndex,
                                }) => {
                                    const filteredResults = searchResults.filter(result =>
                                        result.toLowerCase().startsWith(inputValue.toLowerCase())
                                    )
                                    .slice(0, 10);

                                    return (
                                        <div className="relative mt-4">
                                            <input
                                                {...getInputProps({
                                                    placeholder: "Word that describes your mood...",
                                                    className:
                                                        "block w-full p-2 text-lg text-gray-900 appearance-none focus:outline-none bg-transparent",
                                                })}
                                            />
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 animate-pulse"></div>
                                            <ul
                                                {...getMenuProps({
                                                    className: `${
                                                        isOpen ? "block" : "hidden"
                                                    } absolute bg-white border border-gray-300 w-full mt-2 text-left z-10`,
                                                })}
                                            >
                                                {isOpen &&
                                                    filteredResults.map((result, index) => (
                                                        <li
                                                            {...getItemProps({
                                                                key: index,
                                                                index,
                                                                item: result,
                                                                style: {
                                                                    backgroundColor:
                                                                        highlightedIndex === index
                                                                            ? "lightgray"
                                                                            : "white",
                                                                    fontWeight:
                                                                        highlightedIndex === index
                                                                            ? "bold"
                                                                            : "normal",
                                                                    padding: "2",
                                                                    cursor: "pointer",
                                                                },
                                                            })}
                                                        >
                                                            {result}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    );
                                }}
                            </Downshift> 
                        </div>
                    )}
                    {!inputSettings && (
                        <div className="text-left w-full h-80 flex flex-col gap-4">
                            <h2 className="text-white">Describe In Numbers</h2>
                            <div className="flex items-center justify-between">
                                <h4 className="text-white">Valence</h4>
                                <CustomRangeSlider
                                    className="w-96"
                                    min={0}
                                    max={10}
                                    value={valence}
                                    onChange={(newValue) => setValence(newValue)}
                                    leftLabel="Negative"
                                    rightLabel="Positive"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <h4 className="text-white">Arousal</h4>
                                <CustomRangeSlider
                                    min={0}
                                    max={10}
                                    value={arousal}
                                    onChange={(newValue) => setArousal(newValue)}
                                    leftLabel="Low Energy"
                                    rightLabel="High Energy"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <h4 className="text-white">Dominance</h4>
                                <CustomRangeSlider
                                    min={0}
                                    max={10}
                                    value={dominance}
                                    onChange={(newValue) => setDominance(newValue)}
                                    leftLabel="Powerless"
                                    rightLabel="Powerful"
                                />
                            </div>
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