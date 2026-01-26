const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'vlearn',
    password: 'mnltyu',
    database: 'VocLearn'
})

connection.connect();

app.post('/words', (req, res) => {
    const { nb_words, sort} = req.body;
    var ret = [];
    req = 'SELECT WordId_1, WordId_2, Status FROM Stats WHERE WordId_2 >= 196608 LIMIT 50';
    if(sort)
        req = 'SELECT WordId_1, WordId_2, Status FROM Stats WHERE Status = true AND WordId_2 >= 196608 LIMIT 50 ORDER BY Score_1*0.5 + Score_2*0.3 + Score_3*0.2'; // TODO reverse mode
connection.query(req, function(err, rows, fields){
  console.log('Connection result error '+err);
  for(let i=0;i<rows.length;++i){
    ret.push([rows[i]['WordId_1'], rows[i]['WordId_2'], rows[i]['Status']]);
  }
  res.json({ Words: ret});
});
});

app.post('/status', (req, res) => {
  const { wStat } = req.body;
var ret = [];
connection.query('UPDATE Stats SET Status = !Status WHERE WordId_1 = ' + wStat[0] + ' AND WordId_2 = ' + wStat[1], function(err, rows, fields){
  console.log('Connection result error '+err);
  connection.query('Select Status FROM Stats WHERE WordId_1 = ' + wStat[0] + ' AND WordId_2 = ' + wStat[1], function(err, rows, fields){
  res.json((rows[0].Status == true));
  });
});
});

app.post('/updateStat', (req, res) => {
    const { wordsStats, reverseMode } = req.body;
    var ret = [];
    scores = {
    "TP" : 0.5,
    "TN" : 0.2,
    "FP" : 0.0,
    "FN" : 0.0};

    let score = scores[wordsStats[3]];
    let WordId_1 = wordsStats[0];
    let WordId_2 = wordsStats[1];

    let req = '';
    if(reverseMode)
        req = 'UPDATE Stats SET ScoreInv_3 = ScoreInv_2, ScoreInv_2 = ScoreInv_1, ScoreInv_1 = ?, Date = NOW(), HalfLife = CASE WHEN ? > 0 THEN HALF_LIFE*2 ELSE HALF_LIFE END WHERE UserId = 0 AND WordId_1 = ? AND WordId_2 = ?'
    else
        req = 'UPDATE Stats SET Score_3 = Score_2, Score_2 = Score_1, Score_1 = ?, Date = NOW(), HalfLife = CASE WHEN ? > 0 THEN HALF_LIFE*2 ELSE HALF_LIFE END WHERE UserId = 0 AND WordId_1 = ? AND WordId_2 = ?'
    const statement = await connection.prepare(req);
    try {
        // Execute for each record
        for (const record of wordsStats){
            await statement.execute([score, score, WordId_1, WordId_2]);
            console.log(`Updated product ${record.product_id}`);
        }
        // Close the statement
        await statement.close();
    } catch (error) {
        await statement.close();
        throw error;
    } finally{
        res.json(true);
    }
});

app.listen(5000, () => {
  console.log('Backend running');
});
/*
connection.query('SELECT * FROM Words LIMIT 20', function(err, rows, fields){
  //response.end()
  console.log('Connection result error '+err);
  console.log('nb recs '+rows.length);
  for(let i=0;i<rows.length;++i){
    console.log(rows[i]);
    //for(field in fields)
    //  console.log(rows[i][field]);
  }
    console.log(fields);
});
*/
