import React, { useState, useEffect } from 'react';
import FlashCard from './FlashCard.jsx'
import WordsTable from './WordsTable.jsx'
import Words from './Words.json'
import Translations from './Translations.json'
//import './getDeck.jsx'

function App(props){
	const [deck, setDeck] = useState([]);
	//const rows = Array.from({ length: 20 }, (_, i) => ["Word", `Row ${i + 1}`]);
	const [restart, setRestart] = useState(false);
	const [reverse, setReverse] = useState(false);

	async function getDeck(){
		const response = await fetch("http://51.178.142.176:5000/words", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({nb_words: 50})
		});
		const data = await response.json();
		var deck_tmp = []; // list of 20 tuples [word ID 1, word ID 2, status]
		for(let i=0;i<data.Words.length && i<20;++i)
			deck_tmp.push([data.Words[i][0], data.Words[i][1], data.Words[i][2]]);
		setDeck(deck_tmp);
	}

	useEffect(() => {
		getDeck();
	}, []);

	//TODO put a button
	//setReverse(!reverse);

	/*
	//var reverse = false;
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
*/
  return (
	<>
	  {deck.length > 0 ? (
	  <WordsTable deck={deck} />
	  ) : ""}
		{(deck.length >= 20) ? (
			<FlashCard Words={Words} deck={deck} reverse={reverse} trigRestart={setRestart} restart={restart}/>
		) : 'Loading'}
	  <p>L: {deck.length}</p>
	</>
  );
}
export default App;
