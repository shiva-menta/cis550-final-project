import ApiInfo from '../config.json'

// Spotify API Info
const CLIENT_ID = ApiInfo['CLIENT_ID'];
const CLIENT_SECRET = ApiInfo['CLIENT_SECRET'];
const base_url = 'https://api.spotify.com/v1/';
const auth_url = 'https://accounts.spotify.com/api/token';

// Spotify API Parameters
const authParameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
}
const searchParameters = (accessToken) => {
    return {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    }
}

// Spotify API Functions
const authenticate = async () => {
    const response = await fetch(auth_url, authParameters);
    const data = await response.json();
    return data.access_token;
};
const spotifyIdToJSON = async (id, access_token) => {
    const response = await fetch(base_url + 'tracks/' + id, searchParameters(access_token));
    const data = await response.json();

    return {
        link: data.external_urls.spotify,
        image: data.album.images[0].url,
    };
}

export { authenticate, spotifyIdToJSON };
