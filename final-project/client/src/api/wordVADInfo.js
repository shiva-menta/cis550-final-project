import { spotifyIdToJSON } from './spotifyInfo.js';

const getAuthor = async (author_name) => {
    const res = await fetch(`http://localhost:8080/authors/${author_name}`);
    const data = await res.json();
    return data;
}
const getAuthorQuotes = async (author_name) => {
    const res = await fetch(`http://localhost:8080/author_quotes/${author_name}`);
    const data = await res.json();
    return data;
}
const getArtist = async (artist_name) => {
    const res = await fetch(`http://localhost:8080/artists/${artist_name}`);
    const data = await res.json();
    return data;
}
const getArtistSongs = async (artist_name, accessToken) => {
    const res = await fetch(`http://localhost:8080/artist_songs/${artist_name}`);
    const data = await res.json();
    const newData = await Promise.all(data.map(async (item) => {
        if (item.spotifyId.length < 2) {
            return {
                ...item,
                link: "",
                image: "",
            };
        };
        const { link, image } = await spotifyIdToJSON(item.spotifyId, accessToken);
        console.log(link, image)
        return {
            ...item,
            link,
            image,
        };
    }));

    return newData;
}
const getAllWords = async () => {
    const res = await fetch(`http://localhost:8080/words`);
    const data = await res.json();
    return data;
}
const getWordToVad = async (word) => {
    const res = await fetch(`http://localhost:8080/word_to_vad/${word}`);
    const data = await res.json();
    return data;
}
const getAllCreators = async () => {
    const res = await fetch(`http://localhost:8080/creators_vad`);
    const data = await res.json();
    return data;
}
const getAllCreatorsWithinVadRange = async (query, minValence, maxValence, minArousal, maxArousal, minDominance, maxDominance) => {
    const res = await fetch(`http://localhost:8080/creators_vad?prefix=${query}&min_valence=${minValence}&max_valence=${maxValence}&min_arousal=${minArousal}&max_arousal=${maxArousal}&min_dominance=${minDominance}&max_dominance=${maxDominance}`);
    const data = await res.json();
    return data;
}
const getArtistSimilarityScore = async (firstArtist, secondArtist) => {
    const res = await fetch(`http://localhost:8080/creator_similarity/${encodeURIComponent(firstArtist.name)}/${encodeURIComponent(secondArtist.name)}`);
    const data = await res.json();
    return data;
}
const getVadFrequencyInfo = async (selectedWord, threshold) => {
    const response = await fetch(`http://localhost:8080/word_title_vad_frequency/${selectedWord}/${threshold}`);
    const data = await response.json();
    return data;
}
const getTopQuotesAndSongs = async (valence, arousal, dominance, accessToken) => {
    const res = await fetch(`http://localhost:8080/quotes_and_songs/${valence}/${arousal}/${dominance}`);
    const data = await res.json();
    const newData = await Promise.all(data.songs.map(async (item) => {
        if (item.spotifyId.length < 2) {
            return {
                ...item,
                link: "",
                image: "",
            };
        };
        const { link, image } = await spotifyIdToJSON(item.spotifyId, accessToken);
        return {
            ...item,
            link,
            image,
        };
    }));
    return { quotes: data.quotes, songs: newData };
}
const getCountryData = async (accessToken) => {
    const res = await fetch(`http://localhost:8080/country_songs_and_quotes`);
    const data = await res.json();
    const newData = await Promise.all(data.map(async (item) => {
        if (item.spotifyId.length < 2) {
            return {
                ...item,
                link: "",
                image: "",
            };
        };
        const { link, image } = await spotifyIdToJSON(item.spotifyId, accessToken);
        return {
            ...item,
            link,
            image,
        };
    }));
    return newData;
}
const getPlaylists = async (startWord, endWord, threshold, accessToken) => {
    const res = await fetch(`http://localhost:8080/mood_shift_playlist?start_word=${startWord}&end_word=${endWord}&threshold=${threshold}`);
    const data = await res.json();
    const newData = await Promise.all(data.map(async (item) => {
        const ids = [item.id1, item.id2, item.id3];
        for (let i = 0; i < ids.length; i++) {
            if (ids[i].length < 2) {
                item[`link${i + 1}`] = "";
                item[`image${i + 1}`] = "";
            } else {
                const { link, image } = await spotifyIdToJSON(ids[i], accessToken);
                item[`link${i + 1}`] = link;
                item[`image${i + 1}`] = image;
            };
        }
        return item;
    }));
    return newData;
}
const getSongsWithHigherTitleVad = async () => {
    const res = await fetch(`http://localhost:8080/songs_higher_title_vad`);
    const data = await res.json();
    return data;
}

export { getAllWords, getWordToVad, getTopQuotesAndSongs, getPlaylists, getAllCreators, 
    getArtistSimilarityScore, getAllCreatorsWithinVadRange, getAuthor, getAuthorQuotes, 
    getArtist, getArtistSongs, getCountryData, getVadFrequencyInfo, getSongsWithHigherTitleVad 
};