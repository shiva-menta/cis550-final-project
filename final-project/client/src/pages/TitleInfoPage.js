// word_title_vad_frequency
// word_title_average
import { useState, useEffect } from "react";
import Downshift from "downshift";
import './pages.css';

function TitleInfoPage({ color }) {
    const [isSectionOneOpen, setIsSectionOneOpen] = useState(false);
    const [isSectionTwoOpen, setIsSectionTwoOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [vadFrequency, setVadFrequency] = useState([{ Frequency: 0 }, { Frequency: 0 }]);
    const [songList, setSongList] = useState([]);
    const [selectedWord, setSelectedWord] = useState("");

    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };

    useEffect(() => {
        const search = async () => {
            const res = await fetch(`http://localhost:8080/words`);
            const data = await res.json();
            setSearchResults(data);
        }
        search();
    }, []);

    const getVadFrequency = async () => {
        const response = await fetch(`http://localhost:8080/word_title_vad_frequency/${selectedWord}/0.5`);
        const data = await response.json();
        console.log(data)
        setVadFrequency(data);
    }

    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8 text-white">
          <h1>Title Info</h1>
          <p>
            Here, you'll find some more complex queries that take a further look
            into the relationship between title words of songs and VAD words.
          </p>
    
          <div className="w-full">
            <h2 className="cursor-pointer flex items-center" onClick={() => setIsSectionOneOpen(!isSectionOneOpen)}>
              <span
                className={`inline-block w-4 h-4 border-t-2 border-r-2 border-white mr-2 transform ${
                  isSectionOneOpen ? 'rotate-135' : 'rotate-45'
                } transition-all duration-100`}
              ></span>
              Frequency of Songs with VAD Words in Title Falling in Range of VAD Values
            </h2>
            {isSectionOneOpen && (
              <div className="content">
                <div>Given a valid input word (within WordVAD dictionary), find all songs with titles that include the given word and compare the frequency that these songs are within a certain threshold to the word’s VAD values, and do the same for quotes.</div>
                <div className="w-full flex gap-16 text-black">
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
                    <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-32" style={gradientStyle} onClick={getVadFrequency}>Match</button>
                </div>
                <div>{vadFrequency[0].Frequency}</div>
                <div>{vadFrequency[1].Frequency}</div>
              </div>
            )}
          </div>
    
          <div className="w-full">
            <h2 className="cursor-pointer flex items-center" onClick={() => setIsSectionTwoOpen(!isSectionTwoOpen)}>
              <span
                className={`inline-block w-4 h-4 border-t-2 border-r-2 border-white mr-2 transform ${
                  isSectionTwoOpen ? 'rotate-135' : 'rotate-45'
                } transition-all duration-100`}
              ></span>
              Songs with Title Words with Higher VAD Values than the Song’s VAD Values
            </h2>
            {isSectionTwoOpen && (
              <div className="content">
                <div>Return all songs where the average VAD values of the words in a song title is greater than the actual song’s VAD values.</div>
              </div>
            )}
          </div>
        </div>
      );
}

export default TitleInfoPage;