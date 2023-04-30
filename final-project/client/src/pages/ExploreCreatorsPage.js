import { useState, useEffect } from 'react';
import Downshift from 'downshift';
import { Range } from 'react-range';
import { Link } from 'react-router-dom';

function ExploreCreatorsPage({ color }) {
    const [isSearchView, setIsSearchView] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([searchResults]);
    const [isSimilarityScore, setIsSimilarityScore] = useState(false);
    const [similarityData, setSimilarityData] = useState({});
    const [query, setQuery] = useState('');

    const [firstArtist, setFirstArtist] = useState('');
    const [secondArtist, setSecondArtist] = useState('');

    const [minValence, setMinValence] = useState(0);
    const [maxValence, setMaxValence] = useState(10);
    const [minArousal, setMinArousal] = useState(0);
    const [maxArousal, setMaxArousal] = useState(10);
    const [minDominance, setMinDominance] = useState(0);
    const [maxDominance, setMaxDominance] = useState(10);

    const handleButtonClick = (value) => {
        setIsSearchView(value);
    };

    const getSimilarityScore = async () => {
        const res = await fetch(`http://localhost:8080/creator_similarity/${firstArtist.name}/${secondArtist.name}`);
        const data = await res.json();
        
        setSimilarityData(data[0]);
        setIsSimilarityScore(true);
    }

    const filteredSearch = async () => {
        const res = await fetch(`http://localhost:8080/creators_vad?prefix=${query}&min_valence=${minValence}&max_valence=${maxValence}&min_arousal=${minArousal}&max_arousal=${maxArousal}&min_dominance=${minDominance}&max_dominance=${maxDominance}`);
        const data = await res.json();

        setFilteredResults(data);
    }

    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };

    useEffect(() => {
        const search = async () => {
            const res = await fetch(`http://localhost:8080/creators_vad`);
            const data = await res.json();
            setSearchResults(data);
        }
        search();
    }, []);

    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-4">
            <h1 className="text-white">Explore Our Creators</h1>
            <div className="flex gap-4">
                <div
                className={`cursor-pointer py-2 px-4 font-bold w-96 ${
                    isSearchView ? 'border-b-2 border-white' : ''
                }`}
                onClick={() => handleButtonClick(true)}
                >
                <span className="text-white">Search Creators</span>
                </div>
                <div
                className={`cursor-pointer py-2 px-4 font-bold w-96 ${
                    !isSearchView ? 'border-b-2 border-white' : ''
                }`}
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
                    <div className="my-4">
                        <div className="w-full flex items-center gap-16">
                            <h5 className="w-48">Valence</h5>
                            <Range
                                step={0.1}
                                min={0}
                                max={10}
                                values={[minValence, maxValence]}
                                onChange={(values) => {
                                    setMinValence(values[0]);
                                    setMaxValence(values[1]);
                                }}
                                renderTrack={({ props, children }) => (
                                    <div {...props} className="w-full h-2 bg-gray-300">
                                    {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div {...props} className="w-4 h-4 bg-white border border-gray-300" />
                                )}
                            />
                        </div>

                        <div className="w-full flex items-center gap-16">
                            <h5 className="w-48">Arousal</h5>
                            <Range
                                step={0.1}
                                min={0}
                                max={10}
                                values={[minArousal, maxArousal]}
                                onChange={(values) => {
                                    setMinArousal(values[0]);
                                    setMaxArousal(values[1]);
                                }}
                                renderTrack={({ props, children }) => (
                                    <div {...props} className="w-full h-2 bg-gray-300">
                                    {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div {...props} className="w-4 h-4 bg-white border border-gray-300" />
                                )}
                            />
                        </div>

                        <div className="w-full flex items-center gap-16">
                            <h5 className="w-48">Dominance</h5>
                            <Range
                                step={0.1}
                                min={0}
                                max={10}
                                values={[minDominance, maxDominance]}
                                onChange={(values) => {
                                    setMinDominance(values[0]);
                                    setMaxDominance(values[1]);
                                }}
                                renderTrack={({ props, children }) => (
                                    <div {...props} className="w-full h-2 bg-gray-300">
                                    {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div {...props} className="w-4 h-4 bg-white border border-gray-300" />
                                )}
                            />
                        </div>
                    </div>
                    

                    <table className="w-full text-white">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Valence</th>
                        <th>Arousal</th>
                        <th>Dominance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map((result, index) => (
                            <tr key={index}>
                            <td><Link to={`/creator/${result.name}/${result.type === 'Quote Author' ? 'author' : 'artist'}`}>{result.name}</Link></td>
                            <td>{result.type}</td>
                            <td>{result.avg_val}</td>
                            <td>{result.avg_ars}</td>
                            <td>{result.avg_dom}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}
            {!isSearchView && (
                <>
                    <div className="w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            <h4 className="text-white w-1/2">Creator 1</h4>
                            <h4 className="text-white w-1/2">Creator 2</h4>
                        </div>
                        <div className="w-full flex items-center justify-around gap-18">
                            <Downshift
                                itemToString={(item) => (item ? item.name : "")}
                                className='z-10'
                                onChange={setFirstArtist}
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
                                    result.name.toLowerCase().startsWith(inputValue.toLowerCase())
                                    )
                                    .slice(0, 10);

                                    return (
                                    <div className="relative">
                                        <input
                                        {...getInputProps({
                                            placeholder: "Fill this in...",
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
                                                {result.name}
                                            </li>
                                            ))}
                                        </ul>
                                    </div>
                                    );
                                }}
                            </Downshift>
                            <Downshift
                                itemToString={(item) => (item ? item.name : "")}
                                className='z-10'
                                onChange={setSecondArtist}
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
                                    result.name.toLowerCase().startsWith(inputValue.toLowerCase())
                                    )
                                    .slice(0, 10);

                                    return (
                                    <div className="relative">
                                        <input
                                        {...getInputProps({
                                            placeholder: "Fill this in...",
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
                                                {result.name}
                                            </li>
                                            ))}
                                        </ul>
                                    </div>
                                    );
                                }}
                            </Downshift>
                        </div>
                    </div>
                    <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-72 mt-4" style={gradientStyle} onClick={getSimilarityScore}>Get Similarity Score</button>
                    {isSimilarityScore && (
                        <div className="mt-4 flex gap-16 items-center h-48">
                            <div>
                                <div className="font-bold">Overall Similarity Score</div>
                                <div>{similarityData.similarity_score}</div>
                            </div>
                            <div>
                                <div className="font-bold">Valence Difference</div>
                                <div>{similarityData.valence_diff}</div>
                            </div>
                            <div>
                                <div className="font-bold">Arousal Difference</div>
                                <div>{similarityData.arousal_diff}</div>
                            </div>
                            <div>
                                <div className="font-bold">Dominance Difference</div>
                                <div>{similarityData.dominance_diff}</div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ExploreCreatorsPage;