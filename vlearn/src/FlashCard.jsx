import React, { useState , useRef} from 'react';
//import {ActivityIndicator} from 'react-native'; // can't use it
import './FlashCard.css';

function Card({word, highLight, onCardClick}){
	return (
		<button className={highLight} onClick={onCardClick}>{word}</button>
	);
}

function FlashCard(props){
	//TODO
	////const rows = Array.from({ length: 20 }, (_, i) => ["Word", `Row ${i + 1}`]);
	const gameStage = useRef(0); // counter 0 to 4 
	const score = useRef(0); // Score 0
	const stat = useRef([]); // append result for updating the stat at the end of the game
	const [userAns, setUserAns] = useState(-1); // id of the button clicked, -1 means showing the question
	const ans = useRef(Math.floor(Math.random()*4)); // id of the right answer
	const [isLoading, setLoading] = useState(true);
	const [updateStatResult, setUpdateStatResult] = useState({});

	let _highLight = ["question","question","question","question"];

	//console.log(Words);
	//console.log("prog, ans:" + progress + " " + ans);
	//console.log(progress*4+ans);
	var idxAns = ans.current;
	let progress = gameStage.current;

	const onRestartClick = () =>{
		props.trigRestart(true);
	};

	const onCardClick = (idxClicked) => {
		setUserAns(idxClicked);
		setTimeout(() => {
			gameStage.current++;
			setUserAns(-1);
			ans.current = Math.floor(Math.random()*4); // id of the right answer
		}, 1200);
	};

	const updateStat = async () => {
		try{
			const response = await fetch('https://mywebsite.com/endpoint/', { //TODO
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wordsStats: stat.current,
					reverseMode: props.reverse
				}),
			});
			const json = (await response.json());
			setUpdateStatResult(json.status);
		}catch(error){
			console.error(error);
		}finally{
			setLoading(false);
		}
	};

	if(userAns >=0){ // process answer
		let idxClicked = userAns;
		let cardClass = {"TP": "goodAnswer", "FN": "goodAnswer", "FP" : "wrongAnswer", "TN" : "question"};
		for(let i=0;i<4;i++){
			let idDeck = progress*4+userAns, result = "TN";
			// Button class style to display after clicking

			if(i==idxAns && i == idxClicked){
				result = "TP";
				score.current++;
				//update stat
			}else if(i != idxAns && idxClicked == i){
				result = "FP";
			}else if(i == idxAns && i != idxClicked){ // correct answer
				result = "FN";
			} //else TN
			_highLight[i] = cardClass[result];
			stat.current.push(props.deck[idDeck].concat(result));
		}
	}
	let DBG = _highLight;
	let words = ["","","",""];
	let quest;
	if(progress<=4){
		for(let i=0;i<4;++i){
			let idDeck = progress*4+i;
			if(props.reverse)
				words[i] = props.Words[props.deck[idDeck][0]][1];
			else
				words[i] = props.Words[props.deck[idDeck][1]][1];
		}
		let idDeck = progress*4+ans.current;
		if(props.reverse)
			quest = props.Words[props.deck[idDeck][0]][0];
		else
			quest = props.Words[props.deck[idDeck][0]][1];
	}
	/*
	else
		setUserAns(4); // usefull ?
	*/

	if(progress==5){
		//TODO post data
		updateStat();
		// <ActivityIndicator />
		return (
<>
	{isLoading ? (
		<p>loading</p>
	) : (
		<p>Stat updated</p>
	)
	}
	<p>Score: {score.current}/5</p>
	<button onClick={() => onRestartClick()}>Restart</button>
</>
		);
	}
	return (
<>
<table>
<tbody>
	<tr>
		<td colSpan="2">{quest}</td>
	</tr>
	<tr>
		<td>
			<Card word={words[0]} onCardClick={() => onCardClick(0)} highLight={_highLight[0]}/>
		</td>
		<td>
			<Card word={words[1]} onCardClick={() => onCardClick(1)} highLight={_highLight[1]}/>
		</td>
	</tr>
	<tr>
		<td>
			<Card word={words[2]} onCardClick={() => onCardClick(2)} highLight={_highLight[2]}/>
		</td>
		<td>
			<Card word={words[3]} onCardClick={() => onCardClick(3)} highLight={_highLight[3]}/>
		</td>
	</tr>
</tbody>
</table>
<p>{DBG}</p>
</>
	);
}

export default FlashCard;
