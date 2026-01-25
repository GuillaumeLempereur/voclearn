import React, { useState } from 'react';
import Words from './Words.json'

function WordsTable(props){
	const [visibleRows, setVisibleRows] = useState(Array(20).fill(false));
	//const [Wstatus, setWStatus] = useState(Array(20).fill(true));
	//const [Wstatus, setWStatus] = useState(props.deck.map(v => v));
	const [Wstatus, setWStatus] = useState(props.deck.map((v) => v[2]));

	const toggleRow = (index) => {
		setVisibleRows((prev) =>
			prev.map((v, i) => (i === index ? !v : v))
		);
	};
	async function reqToggleStatus(w1, w2, index){
		const response = await fetch("http://51.178.142.176:5000/status", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({wStat : [w1, w2]})
		});
		const data = await response.json();
		setWStatus((prev) =>
			prev.map((v, i) => (i === index ? data : v))
		);
	}
console.log(props.deck);
console.log(Wstatus);
	const toggleStatus = (index) => {
		console.log("plop " + index);
		reqToggleStatus(props.deck[index][0], props.deck[index][1], index);
	};

  return (
    <table border="1">
      <tbody>
	  <tr>
		<th>English</th>
		<th>Mongol</th>
		<th>Status</th>
	</tr>
		{props.deck.map((row, i) => (
			<tr key={i}>
				<td>{Words[row[1]][1]}</td>
				<td onClick={() => toggleRow(i)}>{visibleRows[i] ? Words[row[0]][1]: ''}</td>
				<td>
					<input type="checkbox" checked={Wstatus[i]} onChange={() => toggleStatus(i)}/>
				</td>
			</tr>
	  ))}
      </tbody>
    </table>
  );
}
export default WordsTable;
