import Downshift from "downshift";

export default function TypeInDropdown({ onChangeFunc, results, defaultText, isCreator }) {
    return (
        <Downshift
            itemToString={(item) => (isCreator ? (item ? item.name : "") : (item ? item : ""))}
            className='z-10'
            onChange={onChangeFunc}
        >
            {({
                getInputProps,
                getItemProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
            }) => {
                const filteredResults = results.filter(result =>
                    (isCreator ? result.name : result).toLowerCase().startsWith(inputValue.toLowerCase())
                ).slice(0, 10);

                return (
                    <div className="relative">
                        <input
                            {...getInputProps({
                                placeholder: defaultText ? defaultText : "Type in a word",
                                className: "block w-full p-2 text-lg text-white appearance-none focus:outline-none bg-transparent",
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
                                        {isCreator ? result.name : result}
                                    </li>
                                ))}
                        </ul>
                    </div>
                );
            }}
        </Downshift>
    );
}