import React from "react";
import { useState, useEffect } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import Downshift from 'downshift';
import './pages.css';
import CustomRangeSlider from "../components/CustomRangeSlider";

// top quotes and songs
// get top_words 

function CheckInPage(props) {
    const color = props.color;

    const gradientStyle = {
        background: `hsl(${color}, 100%, 35%, 1)`,
    };

    const [inputSettings, setInputSettings] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedWord, setSelectedWord] = useState('');

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
    }, []);

    return (
        <div className="p-8 h-full w-full flex flex-col text-center items-center gap-8">
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
                            leftLabel="Bad"
                            rightLabel="Good"
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
            <button type="button" className="text-white py-2 px-4 font-bold rounded-lg w-96" style={gradientStyle}>Capture the Moment</button>
        </div>
    );
}

export default CheckInPage;