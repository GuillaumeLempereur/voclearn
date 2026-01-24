import React, { useState } from 'react';
import FlashCard from './FlashCard.jsx';
import Words from './Words.json';

function App(props){
	const [words, setWords] = useState([]);
	const [visibleRows, setVisibleRows] = useState(Array(20).fill(false));
	//var words = [];

  const toggleRow = (index) => {
    setVisibleRows((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

	async function sendData(){
	const response = await fetch("http://51.178.142.176:5000/words", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({nb_words: 50})
	});
		const data = await response.json();
		console.log(data);
		let w = [];
		for(let i=0;i<data.Words.length;++i)
			w.push([Words[data.Words[i][0]][1], Words[data.Words[i][1]][1], data.Words[i][2]]);
		setWords(w);
	}
	sendData();
  return (
	  <>
    <table border="1">
      <tbody>
	  <tr>
		<th>English</th>
		<th>Mongol</th>
	  </tr>
        {words.map((row, i) => (
          <tr key={i}>
            <td>{row[1]}</td>
            <td onClick={() => toggleRow(i)}>
                {visibleRows[i] ? row[0]: ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
	  <FlashCard />
	  </>
  );
}

export default App;
