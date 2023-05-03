// TITLE COMPARISONS PAGE

// Involved Queries:
//     Route 2 (Word Title VAD Comparison)
//     Route 3 (Word Title VAD Frequency)

// Imports
import { useState, useEffect } from "react";
import TypeInDropdown from "../components/TypeInDropdown";
import PaginatedTable from "../components/PaginatedTable";
import './pages.css';

import { getAllWords, getVadFrequencyInfo, getSongsWithHigherTitleVad } from "../api/wordVADInfo";

// Main Component
function TitleComparisonsPage({ color }) {
    // Constants
    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };
    const decimalToPercent = (decimal) => {
        return (Math.round(decimal * 100 * 100) / 100).toFixed(2) + "%";
    }
    const tableDefaults = [
        { name: "Title", value: "Title" },
        { name: "Artist", value: "Artist" },
        { name: "Title Valence", value: "TitleValence" },
        { name: "Title Arousal", value: "TitleArousal" },
        { name: "Title Dominance", value: "TitleDominance" },
        { name: "Song Valence", value: "Valence" },
        { name: "Song Arousal", value: "Arousal" },
        { name: "Song Dominance", value: "Dominance" },
    ];

    // State Hooks
    const [isSectionOneOpen, setIsSectionOneOpen] = useState(false);
    const [isSectionTwoOpen, setIsSectionTwoOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [vadFrequency, setVadFrequency] = useState([{ Frequency: 0 }, { Frequency: 0 }]);
    const [searchedWord, setSearchedWord] = useState("");
    const [songList, setSongList] = useState([]);
    const [selectedWord, setSelectedWord] = useState("");

    // Effect Hook
    useEffect(() => {
        getAllWords()
            .then(data => setSearchResults(data));
        getSongsWithHigherTitleVad()
            .then(data => setSongList(data));
    }, []);

    // getContent Function
    const getVadFrequency = async () => {
        if (selectedWord === "") {
            alert("Please select a word.");
            return;
        }
        getVadFrequencyInfo(selectedWord, 0.5)
            .then(data => setVadFrequency(data))
            .then(() => setSearchedWord(selectedWord));
    }
    
    // Render Function
    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8 text-white">
            <h1>Title Comparisons</h1>
            <p>Here, you'll find some more complex queries that take a further look into the relationship between VAD words and song titles / quotes.</p>
            <div className="w-full">
                <h2 className="cursor-pointer flex items-center" onClick={() => setIsSectionOneOpen(!isSectionOneOpen)}>
                    <span
                        className={`inline-block w-4 h-4 border-t-2 border-r-2 border-white mr-4 transform ${
                        isSectionOneOpen ? 'rotate-135' : 'rotate-45'
                        } transition-all duration-100`}
                    ></span>
                    Frequency of Songs with VAD Words in Title Falling in Range of VAD Values
                </h2>
            {isSectionOneOpen && (
                <div className="content">
                    <div className="px-8">Given a valid input word (within WordVAD dictionary), find all songs with titles that include the given word and compare the frequency that these songs are within a word’s VAD values (given a 0.5 threshold), and do the same for quotes.</div>
                    <div className="w-full flex gap-16 text-black justify-center mt-4">
                        <TypeInDropdown onChangeFunc={setSelectedWord} results={searchResults} defaultText={"Type in word..."} />
                        <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-32" style={gradientStyle} onClick={getVadFrequency}>Match</button>
                        <div className="text-white flex flex-col">
                            <div><b>Search results for:</b></div>
                            <div>{searchedWord}</div>
                        </div>
                        <div className="text-white w-96 flex">
                            <div><b>Song Title Frequency:</b> {decimalToPercent(vadFrequency[0].Frequency)}</div>
                            <div><b>Quote Frequency:</b> {decimalToPercent(vadFrequency[1].Frequency)}</div>
                        </div>
                    </div>
                </div>
            )}
            </div>
            <div className="w-full">
                <h2 className="cursor-pointer flex items-center" onClick={() => setIsSectionTwoOpen(!isSectionTwoOpen)}>
                    <span
                        className={`inline-block w-4 h-4 border-t-2 border-r-2 border-white mr-4 transform ${isSectionTwoOpen ? 'rotate-135' : 'rotate-45'} transition-all duration-100`}
                    ></span>
                    Songs with Title Words with Higher VAD Values than the Song’s VAD Values
                </h2>
                {isSectionTwoOpen && (
                    <div className="content">
                        <div className="px-8">Return all songs where the average VAD values of the words in a song title is greater than the actual song’s VAD values.</div>
                        <PaginatedTable songList={songList} tableDefaults={tableDefaults}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TitleComparisonsPage;