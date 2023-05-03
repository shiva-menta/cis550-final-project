import Card from 'react-bootstrap/Card';
import "./components.css"

function SongCard({ title, artist, image, link }) {
    function cutString(string, maxLength) {
        if (string.length > maxLength) {
            return string.substring(0, maxLength) + '...';
        }
        return string;
    }

    return (
        <a href={link === '' ? 'https://open.spotify.com/' : link} target="_blank" rel="noopener noreferrer" className="no-underline text-black">
            <Card className="song-card shadow-md">
                <Card.Img src={image === '' ? require('../assets/none.png') : image} className="song-image"/>
                <Card.Title className="mt-2">{cutString(title, 30)}</Card.Title>
                <Card.Subtitle className="opacity-50">{cutString(artist, 20)}</Card.Subtitle>
            </Card>
        </a>
    );
}

export default SongCard;