import Card from 'react-bootstrap/Card';

function SongCard({ title, artist, image, link }) {
    console.log(image)

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="no-underline text-black">
            <Card className="h-72 p-2">
                <Card.Img src={image} className="h-48 w-48"/>
                <Card.Title className="mt-2">{title}</Card.Title>
                <Card.Subtitle className="opacity-50">{artist}</Card.Subtitle>
            </Card>
        </a>
    );
}

export default SongCard;