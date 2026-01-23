import React, { useState } from 'react';
import FlashCard from './FlashCard.jsx'
import Words from './Words.json'
import Translations from './Translations.json'

function App(props){
	//const rows = Array.from({ length: 20 }, (_, i) => ["Word", `Row ${i + 1}`]);
	const [visibleRows, setVisibleRows] = useState(Array(20).fill(false));
	const [restart, setRestart] = useState(false);
	const [reverse, setReverse] = useState(false);

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
	}
	sendData();
	// restart doesn't work !!!

	//TODO put a button
	//setReverse(!reverse);

	//var reverse = false;
	var deck = []; // list of 20 tuples [word ID 1, word ID 2]
	for(const w1ID in Translations){ //TODO fix it no twice same ID!!!! language handle
		for(const w2ID in Translations[w1ID]){
			if(w2ID < 196608) // skip korean
				continue;
			deck.push([w1ID, w2ID]);

			break; // continue with a different word
		}
		if(deck.length==20)
			break;
	}

  return (
	  <>
    <table border="1">
      <tbody>
	  <tr>
		<th>English</th>
		<th>Mongol</th>
		<th>Status</th>
	</tr>
		{props.words.map((row, i) => (
			<tr key={i}>
				<td>{row[1]}</td>
				<td onClick={() => toggleRow(i)}>{visibleRows[i] ? row[0]: ''}</td>
				<td>
					<input type="checkbox" checked={row[2]}/>
				</td>
			</tr>
	  ))}
      </tbody>
    </table>
	  <FlashCard Words={Words} deck={deck} reverse={reverse} trigRestart={setRestart} restart={restart}/>
	  </>
  );
}
export default App;
