
const base_url = 'https://api.spotify.com/v1/';

async function spotifyIdToJSON(id, accessToken) {
    var searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
    }

    const response = await fetch(base_url + 'tracks/' + id, searchParameters)
    const data = await response.json();

    if (data.error) {
        return {
            link: 'https://open.spotify.com/',
            image: 'none',
        };
    }

    return {
        link: data.external_urls.spotify,
        image: data.album.images[0].url,
    };
}

export default spotifyIdToJSON;