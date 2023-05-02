// imports
const mysql = require('mysql')
const config = require('./config.json')

// create connection
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  timeout: 10000
});
connection.connect((err) => err && console.log(err));

// ROUTES

// Route 1: Get All Words
const words = async function(req, res) {
  connection.query(`
    SELECT w.Word
    FROM WordVAD w
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map(obj => obj.Word));
      return res;
    }
  })
}

// Route 2: Get Summarized Statistics for an Artist
const artists = async function(req, res) {
  const artist_name = req.params.artist_name;

  connection.query(`
    SELECT av.artist_name_display,
      av.avg_val,
      av.avg_ars,
      av.avg_dom,
      (
          SELECT vw1.word
          FROM WordVAD vw1
          ORDER BY POWER(vw1.valence - av.avg_val, 2) + 
                  POWER(vw1.arousal - av.avg_ars, 2) + POWER(vw1.dominance - av.avg_dom, 2) ASC
          LIMIT 1
      ) AS closest_word
    FROM ArtistsVAD av
    WHERE av.artist_name_display = '${artist_name}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 3: Get Summarized Statistics for an Author
const authors = async function(req, res) {
  const author = req.params.author_name;

  connection.query(`
    SELECT au.author_name_display,
      au.avg_val,
      au.avg_ars,
      au.avg_dom,
      (
          SELECT vw1.word
          FROM WordVAD vw1
          ORDER BY POWER(vw1.valence - au.avg_val, 2) + 
                  POWER(vw1.arousal - au.avg_ars, 2) + POWER(vw1.dominance - au.avg_dom, 2) ASC
          LIMIT 1
      ) AS closest_word
    FROM AuthorsVAD au
    WHERE au.author_name_display = '${author}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 4: Get All Songs by an Artist
const artist_songs = async function(req, res) {
  const artist_name = req.params.artist_name;

  connection.query(`
    SELECT s.artist_name_display AS artist, s.title AS title, s.spotify_id AS spotifyId
    FROM Song s
    WHERE s.artist_name_display = '${artist_name}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 5: Get All Quotes by an Author
const author_quotes = async function(req, res) {
  const author_name = req.params.author_name;

  connection.query(`
    SELECT q.author_name_display AS author, q.quote
    FROM Quote q
    WHERE q.author_name_display = '${author_name}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 6: Get the VAD values of a Word
const word_to_vad = async function(req, res) {
  const word = req.params.word;

  connection.query(`
    SELECT *
    FROM WordVAD w
    WHERE w.Word = '${word}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 7: Get the Top Ten Quotes and Songs for a VAD Set
const quotes_and_songs = async function(req, res) {
  const valence = req.params.valence;
  const arousal = req.params.arousal;
  const dominance = req.params.dominance;

  const querySongs = () => new Promise((resolve, reject) => {
    connection.query(`
      SELECT s.spotify_id AS spotifyId, s.title, s.artist_name_display AS artist
      FROM Song s
      ORDER BY POWER(s.valence - ${valence}, 2) 
      + POWER(s.arousal - ${arousal}, 2) 
      + POWER(s.dominance - ${dominance}, 2) ASC
      LIMIT 10  
    `, (err, data) => {
      if (err || data.length === 0) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const queryQuotes = () => new Promise((resolve, reject) => {
    connection.query(`
      SELECT q.author_name_display AS author, q.quote
      FROM Quote q
      ORDER BY POWER(q.valence - ${valence}, 2) 
      + POWER(q.arousal - ${arousal}, 2) 
      + POWER(q.dominance - ${dominance}, 2) ASC
      LIMIT 10  
    `, (err, data) => {
      if (err || data.length === 0) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  try {
    const songs = await querySongs();
    const quotes = await queryQuotes();
    res.json({ songs, quotes });
  } catch (err) {
    console.log(err);
    res.json({});
  }
}

// Route 8: Get All Creators who have an Average VAD within a certain range
const creators_vad = async function(req, res) {
  const prefix = req.query.prefix ?? "";
  const min_valence = req.query.min_valence ?? 0;
  const max_valence = req.query.max_valence ?? 10;
  const min_arousal = req.query.min_arousal ?? 0;
  const max_arousal = req.query.max_arousal ?? 10;
  const min_dominance = req.query.min_dominance ?? 0;
  const max_dominance = req.query.max_dominance ?? 10;

  connection.query(`
    SELECT au.author_name_display AS name, 'Quote Author' AS type, au.avg_val, au.avg_ars, au.avg_dom
    FROM AuthorsVAD au
    WHERE au.avg_val BETWEEN ${min_valence} and ${max_valence}
    AND au.avg_ars BETWEEN ${min_arousal} and ${max_arousal}
    AND au.avg_dom BETWEEN ${min_dominance} and ${max_dominance}
    ${prefix === "" ? "" : `AND au.author_name_display LIKE '${prefix}%'`}

    UNION
    
    SELECT ar.artist_name_display AS name, 'Song Artist' AS type, ar.avg_val, ar.avg_ars, ar.avg_dom
    FROM ArtistsVAD ar
    WHERE ar.avg_val BETWEEN ${min_valence} and ${max_valence}
    AND ar.avg_ars BETWEEN ${min_arousal} and ${max_arousal}
    AND ar.avg_dom BETWEEN ${min_dominance} and ${max_dominance}
    ${prefix === "" ? "" : `AND ar.artist_name_display LIKE '${prefix}%'`}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 9: Get Similarity Scoring Between Two Artists
const creator_similarity = async function(req, res) {
  const creator1_name = req.params.creator1_name;
  const creator2_name = req.params.creator2_name;

  connection.query(`
    WITH CreatorVAD AS (
      SELECT au.author_name_display AS name, 'Quote Author' AS type, au.avg_val, au.avg_ars, au.avg_dom
      FROM AuthorsVAD au

      UNION
      
      SELECT ar.artist_name_display AS name, 'Song Artist' AS type, ar.avg_val, ar.avg_ars, ar.avg_dom
      FROM ArtistsVAD ar
    )

    SELECT c1.avg_val - c2.avg_val AS valence_diff,
    c1.avg_ars - c2.avg_ars AS arousal_diff,
    c1.avg_dom - c2.avg_dom AS dominance_diff,
    SQRT(POWER(c1.avg_val - c2.avg_val, 2) + POWER(c1.avg_ars -  c2.avg_ars, 2) + POWER(c1.avg_dom - c2.avg_dom, 2)) AS similarity_score
    FROM CreatorVAD c1, CreatorVAD c2
    WHERE c1.name = '${creator1_name}' AND c2.name = '${creator2_name}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 10: Get Songs / Quotes with Word in Title and Frequency of VAD within piece's range
const word_title_vad_frequency = async function(req, res) {
  const word = req.params.word;
  const tolerance = req.params.tolerance;

  connection.query(`
    WITH Selected_Word_VAD AS (
      SELECT Valence, Arousal, Dominance
      FROM WordVAD
      WHERE word = '${word}'
    ),
    Filtered_Songs AS (
      SELECT *
      FROM Song
      WHERE LOWER(title) LIKE '%${word}%'
    ),
    Filtered_Quotes AS (
      SELECT *
      FROM Quote
      WHERE LOWER(quote) LIKE '%${word}%'
    ),
    Songs_In_Range AS (
      SELECT s.*
      FROM Filtered_Songs s, Selected_Word_VAD v
      WHERE ABS(s.Valence - v.Valence) <= ${tolerance}
      AND ABS(s.Arousal - v.Arousal) <= ${tolerance}
      AND ABS(s.Dominance - v.Dominance) <= ${tolerance}
    ),
    Quotes_In_Range AS (
      SELECT q.*
      FROM Filtered_Quotes q, Selected_Word_VAD v
      WHERE ABS(q.valence - v.Valence) <= ${tolerance}
      AND ABS(q.arousal - v.Arousal) <= ${tolerance}
      AND ABS(q.dominance - v.Dominance) <= ${tolerance}
    )

    SELECT 'Song' AS Type, (COUNT(*) * 1.0) / (SELECT COUNT(*) FROM Filtered_Songs) AS Frequency
    FROM Songs_In_Range

    UNION ALL

    SELECT 'Quotes' AS Type, (COUNT(*) * 1.0) / (SELECT COUNT(*) FROM Filtered_Quotes) AS Frequency
    FROM Quotes_In_Range
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 11: Get Songs with Higher VAD in Title than in Song
const songs_higher_title_vad = async function(req, res) {
  connection.query(`
    WITH RECURSIVE TitleWords (spotify_id, Title, Word, Rest) AS (
      SELECT
        spotify_id,
        Title,
        TRIM(SUBSTRING_INDEX(Title, ' ', 1)) AS Word,
        TRIM(SUBSTRING(Title, LENGTH(SUBSTRING_INDEX(Title, ' ', 1)) + 2)) AS Rest
      FROM
        Song
      UNION ALL
      SELECT
        spotify_id,
        Title,
        TRIM(SUBSTRING_INDEX(Rest, ' ', 1)) AS Word,
        TRIM(SUBSTRING(Rest, LENGTH(SUBSTRING_INDEX(Rest, ' ', 1)) + 2)) AS Rest
      FROM
        TitleWords
      WHERE
        Rest != ''
    ),
    TitleWordVAD AS (
      SELECT
        TitleWords.spotify_id,
        TitleWords.Title,
        WordVAD.Valence,
        WordVAD.Arousal,
        WordVAD.Dominance
      FROM
        TitleWords
        JOIN WordVAD ON TitleWords.Word = WordVAD.Word
    ),
    TitleVAD AS (
      SELECT
        spotify_id,
        Title,
        AVG(Valence) AS TitleValence,
        AVG(Arousal) AS TitleArousal,
        AVG(Dominance) AS TitleDominance
      FROM
        TitleWordVAD
      GROUP BY
        spotify_id,
        Title
    )
   
    SELECT
      S.Title,
      S.Valence,
      S.Arousal,
      S.Dominance,
      S.artist_name_display AS Artist,
      VAD.TitleValence,
      VAD.TitleArousal,
      VAD.TitleDominance
    FROM
      Song S
      JOIN TitleVAD VAD ON S.Title = VAD.Title
    WHERE
      VAD.TitleValence > S.Valence
      AND VAD.TitleArousal > S.Arousal
      AND VAD.TitleDominance > S.Dominance;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 12: Get Signature Song & Quote of a Country
const country_songs_and_quotes = async function(req, res) {
  connection.query(`
    WITH SongCountry AS (
      SELECT a.country, s.title as content, s.artist_name_display as creator, s.valence, s.arousal, s.dominance, s.spotify_id
      FROM Song s JOIN Artist a ON s.artist_name_normal=a.name_normal
      WHERE country <> 'unknown'
    ),
    QuoteCountry AS (
      SELECT a.country, q.quote as content, q.author_name_display as creator, q.valence, q.arousal, q.dominance, NULL as spotify_id
      FROM Quote q JOIN Author a ON q.author_name_normal=a.name_normal
      WHERE country <> 'unknown'
    ),
    AllCountry AS (
      SELECT * FROM SongCountry
      UNION
      SELECT * FROM QuoteCountry
    ),
    CountryVAD AS
      (SELECT country, avg(valence) as avg_val, avg(arousal) as avg_ars, avg(dominance) as avg_dom
      FROM AllCountry
      GROUP BY country
    )

    SELECT c.Country AS country, s.content AS title, s.creator AS artist, q.content AS quote, q.creator AS author, c.avg_val AS valence, c.avg_ars AS arousal, c.avg_dom AS dominance, s.spotify_id AS spotifyId
    FROM CountryVAD c
      JOIN SongCountry s ON c.country = s.country
      JOIN QuoteCountry q ON c.country = q.country
    WHERE
      (s.content, s.creator) IN
          (SELECT * FROM (
                SELECT content, creator FROM SongCountry
                WHERE country = c.country
                ORDER BY (ABS(valence - c.avg_val) + ABS(arousal - c.avg_ars) + ABS(dominance - c.avg_dom))
                LIMIT 1
            ) AS best_song)

    AND
      (q.content, q.creator) IN
            (SELECT * FROM (
                SELECT content, creator FROM QuoteCountry
                WHERE country = c.country
                ORDER BY (ABS(valence - c.avg_val) + ABS(arousal - c.avg_ars) + ABS(dominance - c.avg_dom))
                LIMIT 1
            ) AS best_quote)
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

// Route 13: Get Mood Shift Playlist
const mood_shift_playlist = async function(req, res) {
  const start_word = req.query.start_word;
  const end_word = req.query.end_word;
  const threshold = req.query.threshold ?? 1;

  console.log(start_word, end_word, threshold)

  connection.query(`
    WITH Word1 AS 
      (SELECT 'word1' as word, w1.valence, w1.arousal, w1.dominance
      FROM WordVAD w1
      WHERE w1.word = '${start_word}'),
    Word3 AS 
      (SELECT 'word3' as word, w3.valence, w3.arousal, w3.dominance
      FROM WordVAD w3
      WHERE w3.word = '${end_word}'),
    Word2 AS (
      SELECT 'word2' as word,
      (w1.valence + w3.valence) / 2 AS valence,
      (w1.arousal + w3.arousal) / 2 AS arousal,
      (w1.dominance + w3.dominance) / 2 AS dominance
      FROM Word1 w1, Word3 w3
      ),
    StartingSong AS (
      SELECT spotify_id, title, artist_name_display
      FROM Song s1
        JOIN Word1 w1 ON (
          ABS(w1.valence - s1.valence) <= ${threshold} AND
          ABS(w1.arousal - s1.arousal) <= ${threshold} AND
          ABS(w1.dominance - s1.dominance) <= ${threshold})

      ORDER BY SQRT(
      POW( (w1.valence - s1.valence), 2)
      + POW( (w1.arousal - s1.arousal), 2)
      + POW( (w1.dominance - s1.dominance), 2)
      )

      LIMIT 30
      ),
    MiddleSong AS (
      SELECT spotify_id, title, artist_name_display
      FROM Song s2
        JOIN Word2 w2 ON (
          ABS(w2.valence - s2.valence) <= ${threshold} AND
          ABS(w2.arousal - s2.arousal) <= ${threshold} AND
          ABS(w2.dominance - s2.dominance) <= ${threshold})

      ORDER BY SQRT(
        POW( (w2.valence - s2.valence), 2)
        + POW( (w2.arousal - s2.arousal), 2)
        + POW( (w2.dominance - s2.dominance), 2)
      )

      LIMIT 30
      ),
    ThirdSong AS (
      SELECT spotify_id, title, artist_name_display
      FROM Song s3
        JOIN Word3 w3 ON (
          ABS(w3.valence - s3.valence) <= ${threshold} AND
          ABS(w3.arousal - s3.arousal) <= ${threshold} AND
          ABS(w3.dominance - s3.dominance) <= ${threshold})

      ORDER BY SQRT(
        POW( (w3.valence - s3.valence), 2)
        + POW( (w3.arousal - s3.arousal), 2)
        + POW( (w3.dominance - s3.dominance), 2)
      )

      LIMIT 30
      )
    SELECT s.spotify_id AS id1, s.title AS title1, s.artist_name_display AS artist1, m.spotify_id AS id2, m.title AS title2, m.artist_name_display AS artist2, t.spotify_id AS id3, t.title AS title3, t.artist_name_display AS artist3
    FROM StartingSong s, MiddleSong m, ThirdSong t
    ORDER BY RAND()
    LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
      return res;
    }
  })
}

module.exports = {
  quotes_and_songs,
  creators_vad,
  creator_similarity,
  artists,
  country_songs_and_quotes,
  word_title_vad_frequency,
  mood_shift_playlist,
  words,
  word_to_vad,
  authors,
  author_quotes,
  artist_songs,
  songs_higher_title_vad
}

// Old Routes
// const top_words = async function(req, res) {
//   const valence = req.params.valence;
//   const arousal = req.params.arousal;
//   const dominance = req.params.dominance;

//   connection.query(`
//     SELECT w.Word
//     FROM WordVAD w
//     ORDER BY POWER(w.Valence - ${valence}, 2) 
//     + POWER(w.Arousal - ${arousal}, 2) 
//     + POWER(w.Dominance - ${dominance}, 2) ASC
//     LIMIT 1
//   `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data.map(obj => obj.Word));
//       return res;
//     }
//   })
// }