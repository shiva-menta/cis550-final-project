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
app.get('/top_words/:valence/:arousal/:dominance', routes.top_words);
app.get('/quotes_and_songs/:valence/:arousal/:dominance', routes.quotes_and_songs);
app.get('/creators_vad', routes.creators_vad);
app.get('/creator_similarity/:creator1_id/:creator2_id', routes.creator_similarity);
app.get('/artists/:artist_id', routes.artists);
app.get('/title_song_vad_comparison', routes.title_song_vad_comparison);
app.get('/word_title_vad_frequency/:word', routes.word_title_vad_frequency);
app.get('/country_songs_and_quotes', routes.signature_song_and_quote);
app.get('/mood_shift_playlist', routes.mood_shift_playlist);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
