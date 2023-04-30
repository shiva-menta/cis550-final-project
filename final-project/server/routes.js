const mysql = require('mysql')
const config = require('./config.json')

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: Get /top_words given VAD values
const top_words = async function(req, res) {
  const valence = req.params.valence;
  const arousal = req.params.arousal;
  const dominance = req.params.dominance;

  connection.query(`
    SELECT w.Word
    FROM WordVAD w
    ORDER BY POWER(w.Valence - ${valence}, 2) 
    + POWER(w.Arousal - ${arousal}, 2) 
    + POWER(w.Dominance - ${dominance}, 2) ASC
    LIMIT 10
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

// Route 2: Get top quotes and songs given VAD values
const quotes_and_songs = async function(req, res) {
  const valence = req.params.valence;
  const arousal = req.params.arousal;
  const dominance = req.params.dominance;

  const querySongs = () => new Promise((resolve, reject) => {
    connection.query(`
      SELECT s.spotify_id, s.title
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

// Route 3: Get /creators_vad – All creators that have produced content within a specific VAD range
const creators_vad = async function(req, res) {
  const min_valence = req.query.min_valence ?? 0;
  const max_valence = req.query.max_valence ?? 7;
  const min_arousal = req.query.min_arousal ?? 0;
  const max_arousal = req.query.max_arousal ?? 7;
  const min_dominance = req.query.min_dominance ?? 0;
  const max_dominance = req.query.max_dominance ?? 7;

  connection.query(`
    SELECT au.author_name_display AS name, 'Quote Author' AS type
    FROM AuthorsVAD au
    WHERE au.avg_val BETWEEN ${min_valence} and ${max_valence}
    AND au.avg_ars BETWEEN ${min_arousal} and ${max_arousal}
    AND au.avg_dom BETWEEN ${min_dominance} and ${max_dominance}

    UNION
    
    SELECT ar.artist_name_display AS name, 'Song Artist' AS type
    FROM ArtistsVAD ar
    WHERE ar.avg_val BETWEEN ${min_valence} and ${max_valence}
    AND ar.avg_ars BETWEEN ${min_arousal} and ${max_arousal}
    AND ar.avg_dom BETWEEN ${min_dominance} and ${max_dominance}
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

// Route 4: Get /artist_similarity between two artists
const creator_similarity = async function(req, res) {
  const creator1_name = req.params.creator1_id;
  const creator2_name = req.params.creator2_id;

  connection.query(`
    SELECT c1.avg_val - c2.avg_val AS valence_diff,
    c1.avg_ars - c2.avg_ars AS arousal_diff,
    c1.avg_dom - c2.avg_dom AS dominance_diff,
    SQRT(POWER(c1.avg_val - c2.avg_val, 2) + POWER(c1.avg_ars -  c2.avg_ars, 2) + POWER(c1.avg_dom - c2.avg_dom, 2)) AS similarity_score
    FROM ArtistsVAD c1, ArtistsVAD c2
    WHERE c1.artist_name_display = '${creator1_name}' AND c2.artist_name_display = '${creator2_name}';
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

// Route 5: Get /artists/:artist_id
const artists = async function(req, res) {
  const artist_name = req.params.artist_id;

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

// Route 7: Find pieces with song in title and how frequently they're in a certain threshold of word's VAD
const word_title_vad_frequency = async function(req, res) {
  const word = req.params.word;
  const tolerance = req.params.tolerance;

  connection.query(`
	WITH Selected_Word_VAD AS (
		SELECT Valence, Arousal, Dominance
		FROM WordVAD
		WHERE word = ${word}
	),
	Filtered_Songs AS (
		SELECT *
		FROM Song
		WHERE title LIKE CONCAT('%', ${word}, '%')
	),
	Filtered_Quotes AS (
		SELECT *
		FROM Quote
		WHERE quote LIKE CONCAT('%', ${word}, '%')
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

// Route 8: Get Signature Song & Quote of a Country
const country_songs_and_quotes = async function(req, res) {
  connection.query(`
  	WITH SongCountry AS (
	    SELECT a.country, s.title as content, s.artist_name_display as creator, s.valence, s.arousal, s.dominance
	    FROM Song s JOIN Artist a ON s.artist_name_normal=a.name_normal
	    WHERE country <> 'unknown'
	),
    	QuoteCountry AS (
	    SELECT a.country, q.quote as content, q.author_name_display as creator, q.valence, q.arousal, q.dominance
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

	SELECT c.Country, s.content AS title, s.creator as artist, q.content as quote, q.creator as author
	FROM CountryVAD c
		JOIN SongCountry s ON c.country = s.country
		JOIN QuoteCountry q ON c.country = q.country
	WHERE
	    (ABS(s.valence - c.avg_val) + ABS(s.arousal - c.avg_ars) + ABS(s.dominance - c.avg_dom)) <= ALL
		(
		    SELECT (ABS(valence - c.avg_val) + ABS(arousal - c.avg_ars) + ABS(dominance - c.avg_dom))
		    FROM SongCountry
		    WHERE country = s.country
		)
	AND
	    (ABS(q.valence - c.avg_val) + ABS(q.arousal - c.avg_ars) + ABS(q.dominance - c.avg_dom)) <= ALL
		(
		    SELECT (ABS(valence - c.avg_val) + ABS(arousal - c.avg_ars) + ABS(dominance - c.avg_dom))
		    FROM QuoteCountry
		    WHERE country = q.country
		)
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

// Route 9: Get Mood Shift Playlist
const mood_shift_playlist = async function(req, res) {
  const threshold = req.query.des_arousal ?? 1;
  const start_word = req.query.start_word;
  const end_word = req.query.end_word;

  connection.query(`
  WITH Word1 AS 
    (SELECT 'word1' as word, w1.valence, w1.arousal, w1.dominance
    FROM WordVAD w1
    WHERE w1.word = ${start_word}),
  Word3 AS 
    (SELECT 'word3' as word, w3.valence, w3.arousal, w3.dominance
    FROM WordVAD w3
    WHERE w3.word = ${end_word}),
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
  SELECT *
  FROM StartingSong, MiddleSong, ThirdSong
  ORDER BY RAND()
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

// Route 10
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
      console.log(res)
      return res;
    }
  })
}

module.exports = {
  top_words,
  quotes_and_songs,
  creators_vad,
  creator_similarity,
  artists,
  country_songs_and_quotes,
  word_title_vad_frequency,
  mood_shift_playlist,
  words,
}
