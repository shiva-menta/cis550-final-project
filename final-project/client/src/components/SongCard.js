import Card from 'react-bootstrap/Card';
import "./components.css"

function SongCard({ title, artist, image, link }) {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="no-underline text-black">
            <Card className="song-card shadow-md">
                <Card.Img src={image === 'none' ? require(`../assets/${image}.png`) : image} className="song-image"/>
                <Card.Title className="mt-2">{title}</Card.Title>
                <Card.Subtitle className="opacity-50">{artist}</Card.Subtitle>
            </Card>
        </a>
    );
}

export default SongCard;