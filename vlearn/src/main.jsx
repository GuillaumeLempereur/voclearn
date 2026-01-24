import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

var words = [];

import Table from './Table.jsx'
//import words from './data.json'

/*
 *	Shuffle an array,  to be used with map
 *	return the element required by map
 * */
function shuffle(it, i, arr){
	const j = Math.floor(Math.random() * (arr.length-i)) + i;
	[arr[i], arr[j]] = [arr[j], arr[i]];
	return arr[i];
}
/*
let rows = words.map((it, i, ar) => shuffle(it, i, ar));
rows = rows.slice(-20);
console.log(words[0][1]);
*/
createRoot(document.getElementById('root')).render(
	<App/>
)
//	<App words={rows}/>
