import React, { useState , useRef} from 'react';
import './FlashCard.css';

function Card({word, highLight, onCardClick}){
	return (
		<button className={highLight} onClick={onCardClick}>{word}</button>
	);
}

var Words = [
    [
        "\u0431\u0443\u0443\u0434\u0430\u043b",
        "hotel"
    ],
    [
        "\u0430\u043d\u0433\u0438",
        "family"
    ],
    [
        "\u043e\u043d",
        "year"
    ],
    [
        "\u043e\u043b\u043e\u0445",
        "find"
    ],
    [
        "\u0445\u043e\u043e\u043b",
        "food"
    ],
    [
        "\u0437\u0430\u0434\u0433\u0430\u0439",
        "open"
    ],
    [
        "\u044f\u043c\u0430\u0440",
        "which"
    ],
    [
        "\u044f\u0440\u0438\u0445",
        "speak"
    ],
    [
        "\u0431\u0430\u0433\u0430",
        "small"
    ],
    [
        "\u0442\u04af\u04af\u0445",
        "story"
    ],
    [
        "\u0443\u043b\u0430\u0430\u043d \u043b\u043e\u043e\u043b\u044c",
        "tomato"
    ],
    [
        "\u0441\u0430\u0445\u0430\u043b",
        "beard"
    ],
    [
        "\u0433\u044d\u043b\u044d\u043d",
        " monk"
    ],
    [
        "\u04af\u043d\u044d\u0433",
        "fox"
    ],
    [
        "\u0448\u0438\u0440\u044d\u044d",
        "desk"
    ],
    [
        "\u0430\u0432\u044c\u044f\u0430\u0441",
        "skill"
    ],
    [
        "\u0430\u044f\u0433\u0430",
        "cup"
    ],
    [
        "\u0445\u0430\u0433\u0430\u0441",
        " half"
    ],
    [
        "\u04af\u0439\u043b \u04af\u0433",
        "verb"
    ],
    [
        "\u043c\u0443\u0443\u0440",
        "cat"
    ]];

function FlashCard(props){
	//TODO
	////const rows = Array.from({ length: 20 }, (_, i) => ["Word", `Row ${i + 1}`]);
	const gameStage = useRef(0); // counter 0 to 4 
	//const [progress, setProgress] = useState(0); // counter 0 to 4
	const [userAns, setUserAns] = useState(-1); // id of the button clicked, -1 means showing the question
	const ans = useRef(Math.floor(Math.random()*4)); // id of the right answer
	let _highLight = ["question","question","question","question"];

	//console.log(Words);
	//console.log("prog, ans:" + progress + " " + ans);
	//console.log(progress*4+ans);
	var idxAns = ans.current;
	let progress = gameStage.current;
	let quest = Words[progress*4+ans.current][1];

	const onCardClick = (idxClicked) => {
		setUserAns(idxClicked);
		setTimeout(() => {
			gameStage.current++;
			setUserAns(-1);
			ans.current = Math.floor(Math.random()*4); // id of the right answer
		}, 1600);
	};

	if(userAns >=0){ // process answer
		let idxClicked = userAns;
	for(let i=0;i<4;i++){
		if(i==idxAns && i == idxClicked){
			_highLight[i] = "goodAnswer";
		}else if(i != idxAns && idxClicked == i){
			_highLight[i] = "wrongAnswer";
		}else if(i == idxAns && i != idxClicked){ // correct answer
			_highLight[i] = "goodAnswer";
		}else{
			_highLight[i] = "question";
		}
	}
	}
	let DBG = _highLight;
	let words = ["","","",""];
	if(progress<=4)
		for(let i=0;i<4;++i)
			words[i] = Words[progress*4+i][0];
	else
		userAns = 4;
	
	if(userAns==4)
		return (<p>end</p>)
	else
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
