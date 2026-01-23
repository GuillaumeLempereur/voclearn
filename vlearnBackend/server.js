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
  const { nb_words } = req.body;
var ret = [];
connection.query('SELECT WordId_1, WordId_2, Status  FROM Stats WHERE WordId_2 >= 196608 LIMIT 50', function(err, rows, fields){
  console.log('Connection result error '+err);
  for(let i=0;i<rows.length;++i){
    ret.push([rows[i]['WordId_1'], rows[i]['WordId_2'], rows[i]['Status']]);
  }
  res.json({ Words: ret});
});
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
