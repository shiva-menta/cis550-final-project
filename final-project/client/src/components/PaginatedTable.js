import React, { useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

const ITEMS_PER_PAGE = 100;

const PaginatedTable = ({ songList, tableDefaults }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(songList.length / ITEMS_PER_PAGE);

  const handleChangePage = (delta) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + delta;
      if (newPage < 0 || newPage >= pageCount) {
        return prevPage;
      }
      return newPage;
    });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedSongs = songList.slice(startIndex, endIndex);

  return (
    <div className="mt-4">
        <div className="flex justify-end">
            <button
                className="bg-black text-white px-4 py-2 mr-2 rounded-md"
                onClick={() => handleChangePage(-1)}
                disabled={currentPage === 0}
            >
                <AiOutlineArrowLeft />
            </button>
            <button
                className="bg-black text-white px-4 py-2 ml-2 rounded-md"
                onClick={() => handleChangePage(1)}
                disabled={currentPage === pageCount - 1}
            >
                <AiOutlineArrowRight />
            </button>
        </div>
      <table className="w-full text-white mt-2">
        <thead>
          <tr>
            {tableDefaults.map((item, idx) => (
              <th className="w-1/8 text-left" key={idx}>
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedSongs.map((song, index) => (
            <tr key={index}>
              {tableDefaults.map((item, idx) => (
                <td
                  className="w-1/8 overflow-hidden overflow-ellipsis text-left"
                  key={idx}
                >
                  {song[item.value]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginatedTable;