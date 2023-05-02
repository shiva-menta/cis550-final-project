// EXPLORE CREATORS PAGE

// Involved Queries:
//     Route X (Get Artist Similarity Score)
//     Route Y (Get Creators Who Have Produced in a Certain VAD Range)
//     Route Z (Get Mood Shift Playlist)

// Imports
import { useState, useEffect } from 'react';
import { Range } from 'react-range';
import { Link } from 'react-router-dom';

import TypeInDropdown from '../components/TypeInDropdown';

import { getAllCreators, getArtistSimilarityScore, getAllCreatorsWithinVadRange } from "../api/wordVADInfo";

// Main Component
function ExploreCreatorsPage({ color }) {
    // State Hooks
    const [query, setQuery] = useState('');
    const [firstArtist, setFirstArtist] = useState('');
    const [secondArtist, setSecondArtist] = useState('');
    const [minValence, setMinValence] = useState(0);
    const [maxValence, setMaxValence] = useState(10);
    const [minArousal, setMinArousal] = useState(0);
    const [maxArousal, setMaxArousal] = useState(10);
    const [minDominance, setMinDominance] = useState(0);
    const [maxDominance, setMaxDominance] = useState(10);

    const [isSearchView, setIsSearchView] = useState(true);
    const [isSimilarityScore, setIsSimilarityScore] = useState(false);

    const [similarityData, setSimilarityData] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([searchResults]);

    // Effect Hook
    useEffect(() => {
        getAllCreators()
            .then(data => setSearchResults(data));
    }, []);

    // Constants
    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };
    const rangeDefaults = [
        { name: 'Valence', values: [minValence, maxValence], setFunc: [setMinValence, setMaxValence] },
        { name: 'Arousal', values: [minArousal, maxArousal], setFunc: [setMinArousal, setMaxArousal] },
        { name: 'Dominance', values: [minDominance, maxDominance], setFunc: [setMinDominance, setMaxDominance] }
    ];
    const similarityDataDefaults = [
        { name: 'Overall Similarity Score', value: similarityData.similarity_score },
        { name: 'Valence Difference', value: similarityData.valence_diff },
        { name: 'Arousal Difference', value: similarityData.arousal_diff },
        { name: 'Dominance Difference', value: similarityData.dominance_diff }
    ];

    // Helper Functions
    const handleButtonClick = (value) => {
        setIsSearchView(value);
        setIsSimilarityScore(false);
    };
    const getSimilarityScore = async () => {
        if (firstArtist === '' || secondArtist === '') {
            alert("Please fill in both fields.");
            return;
        }

        getArtistSimilarityScore(firstArtist, secondArtist)
            .then(data => {setSimilarityData(data[0])})
            .then(() => setIsSimilarityScore(true));
    }
    const filteredSearch = async () => {
        getAllCreatorsWithinVadRange(query, minValence, maxValence, minArousal, maxArousal, minDominance, maxDominance)
            .then(data => {
                if (Object.keys(data).length === 0) {
                    alert("No results found.");
                }
                setFilteredResults(data)
            });
    }

    // Render Function
    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-4">
            <h1 className="text-white">Explore Our Creators</h1>
            <div className="flex gap-4">
                <div 
                    className={`cursor-pointer py-2 px-4 font-bold w-96 ${isSearchView ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleButtonClick(true)}
                >
                    <span className="text-white">Search Creators</span>
                </div>
                <div 
                    className={`cursor-pointer py-2 px-4 font-bold w-96 ${!isSearchView ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleButtonClick(false)}
                >
                    <span className="text-white">Creator Similarity</span>
                </div>
            </div>
            {isSearchView && (
                <div className="w-full text-white">
                    <div className="w-full flex gap-8">
                        <input
                            type="text"
                            placeholder="Search creators..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-sm text-black"
                        />
                        <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-36" style={gradientStyle} onClick={filteredSearch}>Search</button>
                    </div>
                    <div className="my-4 flex flex-col gap-2">
                        {rangeDefaults.map((range, index) => (
                            <div key={index} className="w-full flex items-center gap-16">
                                <h5 className="w-48 !mb-0">{range.name}</h5>
                                <div className="w-full flex items-center gap-3">
                                    0
                                    <Range
                                        step={0.1}
                                        min={0}
                                        max={10}
                                        values={range.values}
                                        onChange={(values) => {
                                            range.setFunc[0](values[0]);
                                            range.setFunc[1](values[1]);
                                        }}
                                        renderTrack={({ props, children }) => {
                                            const [leftValue, rightValue] = range.values;
                                            const percentLeft = ((leftValue - 0) / (10 - 0)) * 100;
                                            const percentRight = ((rightValue - 0) / (10 - 0)) * 100;
                                            const width = percentRight - percentLeft;
                                        
                                            return (
                                              <div {...props} className="w-full h-2 bg-gray-300 relative">
                                                <div
                                                  style={{ left: `${percentLeft}%`, width: `${width}%` }}
                                                  className="absolute h-2 bg-black"
                                                />
                                                {children}
                                              </div>
                                            );
                                        }}
                                        renderThumb={({ props }) => (
                                            <div {...props} className="w-4 h-4 bg-white border border-gray-300" />
                                        )}
                                    />
                                    10
                                </div>
                                
                            </div>
                        ))}
                    </div>
                    <table className="w-full text-white">
                        <thead>
                            <tr>
                            <th className="w-1/5">Name</th>
                            <th className="w-1/5">Type</th>
                            <th className="w-1/5">Valence</th>
                            <th className="w-1/5">Arousal</th>
                            <th className="w-1/5">Dominance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults &&
                            filteredResults.length > 0 &&
                            filteredResults.map((result, index) => (
                                <tr key={index}>
                                <td className="w-1/5 overflow-hidden overflow-ellipsis">
                                    <Link
                                    to={`/creator/${encodeURIComponent(result.name)}/${
                                        result.type === "Quote Author" ? "author" : "artist"
                                    }`}
                                    className="text-white hover:opacity-50 focus:opacity-50"
                                    >
                                    {result.name}
                                    </Link>
                                </td>
                                <td className="w-1/5 overflow-hidden overflow-ellipsis">
                                    {result.type}
                                </td>
                                <td className="w-1/5 overflow-hidden overflow-ellipsis">
                                    {result.avg_val}
                                </td>
                                <td className="w-1/5 overflow-hidden overflow-ellipsis">
                                    {result.avg_ars}
                                </td>
                                <td className="w-1/5 overflow-hidden overflow-ellipsis">
                                    {result.avg_dom}
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!isSearchView && (
                <>
                    <div className="w-full">
                        <div className="flex flex-row items-center justify-around w-full">
                            <div className="w-1/3">
                                <h4 className="text-white">Creator 1</h4>
                                <TypeInDropdown onChangeFunc={setFirstArtist} results={searchResults} isCreator={true} defaultText={"Choose a first artist..."} />
                            </div>
                            <div className="w-1/3">
                                <h4 className="text-white">Creator 2</h4>
                                <TypeInDropdown onChangeFunc={setSecondArtist} results={searchResults} isCreator={true} defaultText={"Choose a second artist..."} />
                            </div>
                        </div>
                    </div>
                    <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-72 mt-4" style={gradientStyle} onClick={getSimilarityScore}>Get Similarity Score</button>
                    {isSimilarityScore && (
                        <div className="mt-16 flex gap-16 items-center h-24 bg-gray-100 rounded-md shadow-md py-4 px-8">
                            {similarityDataDefaults.map((data, index) => (
                                <div key={index}>
                                    <div className="font-bold">{data.name}</div>
                                    <div>{data.value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ExploreCreatorsPage;