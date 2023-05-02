const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
// app.get('/top_word/:valence/:arousal/:dominance', routes.top_words);
app.get('/words', routes.words);
app.get('/artists/:artist_name', routes.artists);
app.get('/authors/:author_name', routes.authors);
app.get('/artist_songs/:artist_name', routes.artist_songs);
app.get('/author_quotes/:author_name', routes.author_quotes);
app.get('/word_to_vad/:word', routes.word_to_vad);
app.get('/quotes_and_songs/:valence/:arousal/:dominance', routes.quotes_and_songs);
app.get('/creators_vad', routes.creators_vad);
app.get('/creator_similarity/:creator1_name/:creator2_name', routes.creator_similarity);
app.get('/word_title_vad_frequency/:word/:tolerance', routes.word_title_vad_frequency);
app.get('/songs_higher_title_vad', routes.songs_higher_title_vad);
app.get('/country_songs_and_quotes', routes.country_songs_and_quotes);
app.get('/mood_shift_playlist', routes.mood_shift_playlist);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;