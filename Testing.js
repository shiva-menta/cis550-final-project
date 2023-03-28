let phrase = "Hello, world! This is a test string.";
let phraseArray = phrase.toLowerCase().replace(/[\W_]+/g, ' ').split(' ');

console.log(phraseArray);


let cte = "WITH phrase_words (word) AS (\n"
for (let i = 0; i < phraseArray.length; i++) {
    cte += "\tSELECT \"" + phraseArray[i] + "\" as word ";

    if (i !== phraseArray.length - 1) {
        cte += "UNION\n";
    }
}
cte += ")\n"

get_vad = `SELECT AVG(valence) as avg_val, AVG(arousal) as avg_ars, AVG(dominance) as avg_dom
FROM cte JOIN WordToVAD W ON (cte.word == W.word);
`

let query = cte + get_vad;

console.log(query);



  