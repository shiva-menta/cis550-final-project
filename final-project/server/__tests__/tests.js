const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

test('GET /words', async () => {
  await supertest(app).get('/words')
    .expect(200)
    .then((res) => {
      expect(res.body.slice(0, 1)).toStrictEqual(['aardvark']);
    });
});

test('GET /artists/fakeArtist', async () => {
  await supertest(app).get('/artists/fakeArtistName')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /artists/Château Flight', async () => {
  await supertest(app).get('/artists/Château Flight')
    .expect(200)
    .then((res) => {
      expect(res.body.slice(0, 2)).toStrictEqual(results.artists);
    });
});

test('GET /authors/FakeAuthor', async () => {
  await supertest(app).get('/authors/FakeAuthorName')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /authors/Mark Twain', async () => {
  await supertest(app).get('/authors/Mark Twain')
    .expect(200)
    .then((res) => {
      expect(res.body.slice(0, 1)).toStrictEqual(results.authors);
    });
});

test('GET /artist_songs/fakeArtist', async () => {
  await supertest(app).get('/artist_songs/fakeArtistName')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /artist_songs/Chateau Flight', async () => {
  await supertest(app).get('/artist_songs/Château Flight')
    .expect(200)
    .then((res) => {
      expect(res.body.slice(0, 1)).toStrictEqual(results.artists_songs);
    });
});

test('GET /author_quotes/FakeAuthor', async () => {
  await supertest(app).get('/author_quotes/FakeAuthorName')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /author_quotes/Mark Twain', async () => {
  await supertest(app).get('/author_quotes/Mark Twain')
    .expect(200)
    .then((res) => {
      expect(res.body.slice(0, 1)).toStrictEqual(results.authors_quotes);
    });
});

test('GET /word_to_vad/:error', async () => {
  await supertest(app).get('/word_to_vad/:error')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /word_to_vad/excited', async () => {
  await supertest(app).get('/word_to_vad/excited')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.word_to_vad);
    });
});

test('GET /quotes_and_songs/:error/:error/:error', async () => {
  await supertest(app).get('/quotes_and_songs/:error/:error/:error')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /quotes_and_songs/5/5/5', async () => {
  await supertest(app).get('/quotes_and_songs/5/5/5')
    .expect(200)
    .then((res) => {
      expect(res.body.quotes[0].author).toStrictEqual('Oliver Markus Malloy');
    });
});

test('GET /creators_vad data = 0', async () => {
  await supertest(app).get('/creators_vad?min_valence=1.5&max_valence=1.6&min_arousal=2&max_arousal=3&min_dominance=5&max_dominance=6')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /creators_vad data', async () => {
  await supertest(app).get('/creators_vad?min_valence=5.5&max_valence=5.6&min_arousal=5.2&max_arousal=5.3&min_dominance=5.66&max_dominance=5.7')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.creators_vad);
    });
});

test('GET /creator_similarity/:error/:error', async () => {
  await supertest(app).get('/creator_similarity/:error/:error')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /creator_similarity/Mark Twain/Château Flight', async () => {
  await supertest(app).get('/creator_similarity/Mark Twain/Château Flight')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.creator_similarity);
    });
});

test('GET /word_title_vad_frequency/:error/:error', async () => {
  await supertest(app).get('/word_title_vad_frequency/:error/:error')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /word_title_vad_frequency/excited/0.1', async () => {
  await supertest(app).get('/word_title_vad_frequency/excited/0.1')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.word_title_vad_frequency);
    });
});

test('GET /songs_higher_title_vad', async () => {
  await supertest(app).get('/songs_higher_title_vad')
    .expect(200)
    .then((res) => {
      expect(res.body.slice(0, 1)).toStrictEqual(results.songs_higher_title_vad);
    });
});

test('GET /country_songs_and_quotes', async () => {
  await supertest(app).get('/country_songs_and_quotes')
    .expect(200)
    .then((res) => {
      expect(res.body.slice(0, 1)).toStrictEqual(results.country_songs_and_quotes);
    });
}, 10000);

test('GET /mood_shift_playlist', async () => {
  await supertest(app).get('/mood_shift_playlist')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({});
    });
});

test('GET /mood_shift_playlist start & end word', async () => {
  await supertest(app).get('/mood_shift_playlist?start_word=aardvark&end_word=abalone')
    .expect(200)
});