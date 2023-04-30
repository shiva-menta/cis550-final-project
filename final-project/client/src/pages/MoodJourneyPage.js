import { useState, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import Downshift from 'downshift';
import ApiInfo from '../config.json'
import spotifyIdToJSON from "../utils";
import SongCard from "../components/SongCard";

// Spotify ID Imports
const CLIENT_ID = ApiInfo['CLIENT_ID'];
const CLIENT_SECRET = ApiInfo['CLIENT_SECRET'];

function MoodJourneyPage(props) {
    const color = props.color;
    const threshold = 1;

    const [showPlaylist, setShowPlaylist] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [startWord, setStartWord] = useState("");
    const [endWord, setEndWord] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playlistResults, setPlaylistResults] = useState([]);

    const getPlaylists = async () => {
        if (startWord === "" || endWord === "") {
            return;
        }

        const getPlaylistsInfo = async () => {
            const res = await fetch(`http://localhost:8080/mood_shift_playlist?startWord=${startWord}&endWord=${endWord}&threshold=${threshold}`);
            const data = await res.json();
            const newData = await Promise.all(data.map(async (item) => {
                const ids = [item.id1, item.id2, item.id3];
                for (let i = 0; i < ids.length; i++) {
                    const { link, image } = await spotifyIdToJSON(ids[i], accessToken);
                    item[`link${i + 1}`] = link;
                    item[`image${i + 1}`] = image;
                }
                return item;
            }));
            setPlaylistResults(newData);
        }

        getPlaylistsInfo();
        console.log("bruh")
        setShowPlaylist(true);
    }

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

    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8">
            <h1 className="text-white">Create Mood Journey</h1>
            <div className="w-full">
                <div className="flex flex-row items-center justify-between w-full">
                    <h4 className="text-white w-1/3">Current Emotion</h4>
                    <h4 className="text-white w-1/3"></h4>
                    <h4 className="text-white w-1/3">Desired Emotion</h4>
                </div>
                <div className="w-full flex items-center justify-around gap-36">
                    <Downshift
                        itemToString={(item) => (item ? item : "")}
                        className='z-10'
                        onChange={setStartWord}
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
                                <div className="relative">
                                    <input
                                        {...getInputProps({
                                            placeholder: "How you feel now...",
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
                    <AiOutlineArrowRight className="text-white icon"/>
                    <Downshift
                        itemToString={(item) => (item ? item : "")}
                        className='z-10'
                        onChange={setEndWord}
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
                                <div className="relative">
                                    <input
                                        {...getInputProps({
                                            placeholder: "How you want to feel...",
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
            </div>
            <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-72 mt-4" style={gradientStyle} onClick={getPlaylists}>Make Transition Playlist</button>
            {showPlaylist && (
                <div className="w-full flex flex-col gap-8 mt-4">
                    {playlistResults.map((playlist, index) => (
                        <div className="flex flex-col w-full" key={index}>
                            <h4 className="text-white mb-4">{`Playlist #${index + 1}`}</h4>
                            <div className="w-full flex gap-4 items-center justify-center">
                                <SongCard title={playlist.title1} artist={playlist.artist1} image={playlist.image1} link={playlist.link1}/>
                                <AiOutlineArrowRight className="text-white icon"/>
                                <SongCard title={playlist.title2} artist={playlist.artist2} image={playlist.image2} link={playlist.link2}/>
                                <AiOutlineArrowRight className="text-white icon"/>
                                <SongCard title={playlist.title3} artist={playlist.artist3} image={playlist.image3} link={playlist.link3}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            
        </div>
    );
}

export default MoodJourneyPage;