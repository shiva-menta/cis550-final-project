import Card from 'react-bootstrap/Card';

function QuoteCard({ quote, author }) {
    return (
        <Card className="quote-card shadow-md flex justify-center items-center">
            <Card.Title className="font-bold text-black quote-size">{'"' + quote + '"'}</Card.Title>
            <Card.Subtitle className="text-black opacity-50 mt-2 quote-size">{author}</Card.Subtitle>
        </Card>
    );
}

export default QuoteCard;