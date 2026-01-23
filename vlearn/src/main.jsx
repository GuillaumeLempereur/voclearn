import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//import words from './data.json'
//import Stats from './Stats.json' // PB cause ID starts by 0!
import Words from './Words.json'
import Translations from './Translations.json'

/*
 *	Shuffle an array,  to be used with map
 *	return the element required by map
 * */
function shuffle(it, i, arr){
	const j = Math.floor(Math.random() * (arr.length-i)) + i;
	[arr[i], arr[j]] = [arr[j], arr[i]];
	return arr[i];
}

let words = [];
let c = 0;
//for(const w1ID in Stats){
//	for(const w2ID in Stats[w1ID]){
for(const w1ID in Translations){
	for(const w2ID in Translations[w1ID]){
		if(! (w1ID in Words)) // no need
			console.log(w1ID);
		if(! (w2ID in Words))
			console.log(w1ID);
		if(w2ID < "196608")//skip korean
			continue;
		words.push([Words[w2ID][1], Words[w1ID][1], true]); // status active
		c++;
		if(c==20)
			break;
	}
	if(c==20)
		break;
}
console.log(c);

let rows = words.map((it, i, ar) => shuffle(it, i, ar));
rows = rows.slice(-20);
console.log(words[0][1]);


createRoot(document.getElementById('root')).render(
	<App words={rows}/>
)
