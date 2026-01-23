// VocLearn games
//TODO use toggle
var game;

function displayMSGwithRestart(msg, func){
	let restartBut = $('<button>Restart</button>').click(function () {
		game.finishGame();
		func(); // call the provided function
		let posting = $.post( "getWords.php", { NBofWords: 20, gameParameters: JSON.stringify(gameParam)}, 'json' );

		// Put the results in a div
		posting.done(function( words ) {
			game = new MCQ(words, gameParam);
			game.generateGame();
		});
		$("#msg").hide();
	});
	let cancelBut = $('<button>Cancel</button>').click(function () {
		$("#msg").hide();
	});
	$("#msg").html(msg).append(restartBut).append(cancelBut).show();
}

/**
	msg: string to display
	tmout: delay in ms
*/
function displayMSGwithTimeout(msg, timeout){
	$("#msg").html(msg).show();

	// show msg few second then clear it
	setTimeout(function(){
		$("#msg").hide();
	}, timeout);
}

class GameParameters{
	static difficultyLabels = ["Easy", "Intermediate", "Hard", "Extreme"];
	
	constructor(learntLang, masteredLang, reverseLangMode, difficulty){ // can't generate it if game on going !!!
		this.learntLang = learntLang;
		this.masteredLang = masteredLang;
		this.reverseLangMode = reverseLangMode; // True means answer lang is the mastered
		this.difficulty = difficulty;
		this.transliteration = false;
		
		if(this.reverseLangMode){
			$("#answerLang").html(langList[masteredLang]);
			$("#questLang").html(langList[learntLang]);
		}else{
			$("#answerLang").html(langList[learntLang]);
			$("#questLang").html(langList[masteredLang]);
		}
		$("#difficultyLabel").html(GameParameters.difficultyLabels[difficulty]);
	}
	
	toggleTransliteration(){
		this.transliteration = !this.transliteration;
	}
	
	switchQuestAnsLang(){
		this.reverseLangMode = !this.reverseLangMode;
		if(this.reverseLangMode){
			$("#answerLang").html(langList[this.masteredLang]);
			$("#questLang").html(langList[this.learntLang]);
		}else{
			$("#answerLang").html(langList[this.learntLang]);
			$("#questLang").html(langList[this.masteredLang]);
		}
		if(game instanceof Game && (game.progress != 0 && game.progress != 5)){
			displayMSGwithTimeout("Language switching will occur for the next question", 3000);
		}
	}

	getAnswerLang(){
		if(this.reverseLangMode)
			return this.masteredLang;
		else
			return this.learntLang;
	}
	
	getQuestionLang(){
		if(this.reverseLangMode)
			return this.learntLang;
		else
			return this.masteredLang;
	}
	
	setMasteredLang(masteredLang){
		if(masteredLang==this.learntLang){
			displayMSGwithTimeout("The languages must be different!", 3000);
			return this.masteredLang;
		}
		if(game instanceof Game && (game.progress != 5)){
			displayMSGwithRestart("Do you want to change the language and restart a game?", function(){$("#masteredLang").val(masteredLang).change();});
			return this.masteredLang;
		}else{
			this.masteredLang = masteredLang;
			if(this.reverseLangMode){
				$("#answerLang").html(langList[masteredLang]);
			}else{
				$("#questLang").html(langList[masteredLang]);
			}
			return masteredLang;
		}
	}
	
	setLearntLang(learntLang){
		if(this.masteredLang==learntLang){
			displayMSGwithTimeout("The languages must be different!", 3000);
			return this.learntLang;
		}
		if(game instanceof Game && (game.progress != 5)){
			displayMSGwithRestart("Do you want to change the language and restart a game?", function(){$("#learntLang").val(learntLang).change();});
			return this.learntLang;
		}else{
			this.learntLang = learntLang;
			if(this.reverseLangMode){
				$("#questLang").html(langList[learntLang]);
			}else{
				$("#answerLang").html(langList[learntLang]);
			}
			return learntLang;
		}
	}
	
	setDifficulty(difficulty){
		if(game instanceof Game && (game.progress != 5)){
			displayMSGwithRestart("Do you want to change the language and restart a game?", function(){$("#difficulty").val(difficulty).change();});
			return this.difficulty;
		}else{
			$("#difficultyLabel").html(GameParameters.difficultyLabels[difficulty]);
			this.difficulty = difficulty;
			return difficulty;
		}
	}
}

class Game{
	constructor(words, gameParam){
		this.words = words;
		this.answer = 0;
		this.gameParam = gameParam;
		this.progress = 0; // 0 (not yet started) to 5 (done)
		this.answerWordID = 0;
		this.score = 0;
		this.wordsStats = [];
		
		this.loadGame();
	}
	
	loadGame(){}
	
	generateGame(){}
}

class MCQ extends Game{
	
	constructor(words, gameParam){
		super(words, gameParam);
		this.falseAnswersWordID = [];
		this.MCQ_wordsId = [];
	}
	
	loadGame(){
		$("#body").html(`
<table>
	<tr>
		<td colspan="2" id="quest"></td>
	</tr>
	<tr>
		<td><button id="but_0" class="MCQ"></button></td>
		<td><button id="but_1" class="MCQ"></button></td>
	</tr>
	<tr>
		<td><button id="but_2" class="MCQ"></button></td>
		<td><button id="but_3" class="MCQ"></button></td>
	</tr>
</table>
`);
		let _this = this;
		$("button.MCQ").click(function(){
			_this.checkAnswer(parseInt($(this).attr("id")[4]));
		});
	}
	
	generateGame(){
	  this.answer = Math.floor(Math.random()*4); // pick randomly one of the 4 tiles as the question/answer
	  for(var i=0;i<4;i++){
	    let idx = this.progress*4+i;
		this.MCQ_wordsId[i] = idx;
		let proposalCol = this.gameParam.reverseLangMode?1:0;
		let questCol = this.gameParam.reverseLangMode?0:1;
		let explCol = (this.gameParam.reverseLangMode)? 0 : 1;
		let transliCol = (this.gameParam.reverseLangMode)? 2 : 3;
		let wordIdQuest = this.words[idx][proposalCol];
		let wordIdAns = this.words[idx][questCol];
		let w1 = (wordIdQuest < wordIdAns)? wordIdQuest : wordIdAns;
		let w2 = (wordIdQuest < wordIdAns)? wordIdAns : wordIdQuest;
		let tileTxt = Words[wordIdQuest][1];
		if(this.gameParam.transliteration)
			tileTxt += "<br/>("+Translations[w1][w2][transliCol]+")";
		$("#but_"+ i).html(tileTxt);

		if(this.answer==i){ // The tile used as question/answer => write the word as question
			$("#quest").html("Word to find: "+Words[wordIdAns][1]+ " ("+Translations[w1][w2][explCol]+")"); // write the word to find and the explanation
			this.answerWordID = idx; // TBC still useful
		}else{
			this.falseAnswersWordID.push(idx);
		}
	  }
	  this.progress++;
	  // todo update progress barre
	}
	
	checkAnswer(userAnswer){
		let _this = this;
		
		let idx_w1w2 = [0, 1];
		if(gameParam.masteredLang < gameParam.learntLang){
			idx_w1w2 = [1, 0];
		}

		// TODO: should update all stats where words failed
		for(var k=0;k<4;++k){
			let idx = this.progress*4+k-4;
			if(k == userAnswer && userAnswer == this.answer){ // right answer
				$("#but_"+k).addClass("goodAnswer");
				this.score++;
				this.updateStat(this.words[idx][idx_w1w2[0]], this.words[idx][idx_w1w2[1]], "TP");
			}else if(k == this.answer){ // wrong answer: highlight the right one
				$("#but_"+k).addClass("HighlightGoodAnswer");
				this.updateStat(this.words[idx][idx_w1w2[0]], this.words[idx][idx_w1w2[1]], "FN");
			}else if(k == userAnswer){ // wrong answer: highlight the wrong answer
				$("#but_"+k).addClass("wrongAnswer");
				this.updateStat(this.words[idx][idx_w1w2[0]], this.words[idx][idx_w1w2[1]], "FP");
			}else{
				this.updateStat(this.words[idx][idx_w1w2[0]], this.words[idx][idx_w1w2[1]], "TN");
			}
		}
		
		// show result few second then go next MCQ or finish the game
		setTimeout(function(){
			$("#but_"+_this.answer).attr("class","MCQ");
			$("#but_"+userAnswer).attr("class","MCQ");
			
			if(_this.progress < 5){
				_this.generateGame();
			}else{
				_this.finishGame();
				_this.displayResult();
			}
		}, 1000);
	}
	// "SCORE_1": 0, "SCORE_2": 0, "SCORE_3": 0, "SCORE_INV_1": 0, "SCORE_INV_2": 0, "SCORE_INV_3": 0, "DATE": 1682694024, "HALF_LIFE": 7, "STATUS": 1
	updateStat(w1, w2, result){
		var score = 0;
		if(result == "TP")
			score = 0.5;
		else if(result == "TN")
			score = 0.2;
		if(this.gameParam.reverseLangMode){
			if(result[0]=="F")
				score = 0;
			else
				score = Math.max(0.5*Stats[w1][w2][3] + 0.3 * Stats[w1][w2][4] + 0.2 * Stats[w1][w2][5], score);
			Stats[w1][w2][5] = Stats[w1][w2][4];
			Stats[w1][w2][4] = Stats[w1][w2][3]; // 0,1,2 + 3 inv
			Stats[w1][w2][3] = score;
		}else{
			if(result[0]=="F")
				score = 0;
			else
				score = Math.max(0.5*Stats[w1][w2][0] + 0.3 * Stats[w1][w2][1] + 0.2 * Stats[w1][w2][2], score);
			Stats[w1][w2][2] = Stats[w1][w2][1];
			Stats[w1][w2][1] = Stats[w1][w2][0]; // 0,1,2 + 3 if inv
			Stats[w1][w2][0] = score;
		}
		Stats[w1][w2][6] = Date.now();
		Stats[w1][w2][7] *= 2;
		Stats[w1][w2][7] = Math.min(Stats[w1][w2][7], 62);
		this.wordsStats.push(Stats[w1][w2].concat([w1, w2])); // TODO: structure instead of arry !
	}
	
	finishGame(){
		for(var i=0;i<4;i++){
			$("#but_"+i).empty();
			$("#but_"+i).off("click");
		}
		$("#quest").html("Word to find: ");
		this.progress = 5;
	}
	
	displayResult(){
		let msg = "Result: "+this.score+"/"+5+"<br/><button id=\"msgButton\">Restart</button>";
		
		if(!($("#offlineMode").is(':checked'))){
			// Update stats
			var posting = $.post("updateStats.php", {wordsStats: JSON.stringify(this.wordsStats)});
			
			posting.done(function(data){
				//$("#msg").empty().append( data ); // todo : if wrong: connection lost
				console.log(data);
			});
		}
		
		
		$("#disp").html(msg).show();
		localStorage.setItem('Stats', JSON.stringify(Stats));
		$("#msgButton").click(function(){
			$("#disp").hide();
			let words = getGameWords1to1();
			game = new MCQ(words, gameParam);
			game.generateGame()
		});
	}
}

let msg = `
<div><button id="msgButton">Test my Knowledge</button></div>
`;
$("#disp").html(msg).show();

$("#msgButton").click(function(){
			let words = getGameWords1to1();
			game = new MCQ(words, gameParam);
			game.generateGame();
			$("#disp").hide();
});

$("#difficulty").change(function(){
	this.value = gameParam.setDifficulty(this.value);
});

// switch language question <> answer
$("#switchLang").click(function(){
	gameParam.switchQuestAnsLang();
});

$("#masteredLang").change(function(){
	this.value = gameParam.setMasteredLang(this.value);
});

$("#learntLang").change(function(){
	this.value = gameParam.setLearntLang(this.value);
});

// Stop the current game and discard the stats TBC: maybe useless
function abortGame(){
	//delete the game
	$("#body").html();
	game = null;
	let msg = `
	<div><button id="msgButton">Start</button></div>
	`;
	$("#disp").html(msg).show();
}

/* Returns a list of [score, word1ID, word2ID] sorted based on the column chosen
 * start : allows to skip the first #start words, i.e. 100 => skip the 1st 100 words
 * nb : number of word to return if nb=0 then just slice from start to the end.
 * orderIncrement : 0 incremental, otherwise decremental
 * column : 0: score, 1: Word 1, 2: Word 2
 * onlyActive : if 1 then skip the words that are not active, if 2 then take it but put it at the end (tamper score) */
function sort(start = 0, nb = 0, orderIncrement = true, column = 0, onlyActive=1){
	// Create items array
	var items = [];
	var offset = (gameParam.reverseLangMode)?3:0;
	for(w1 in Stats){
		w1_id = parseInt(w1);
		
		//TODO improve by reducing Stats
		if(w1_id < 65536*gameParam.learntLang || w1_id >= 65536*(gameParam.learntLang + 1))
			continue;
		for(w2 in Stats[w1]){
			w2_id = parseInt(w2);
			if(w2_id < 65536*gameParam.masteredLang || w2_id >= 65536*(gameParam.masteredLang + 1))
				continue;
			if(onlyActive==1 && !Stats[w1][w2][8])
				continue;
      else if(onlyActive==2 && !Stats[w1][w2][8])
			  items.push([Stats[w1][w2][0+offset]*0.6 + Stats[w1][w2][1+offset]*0.3 + Stats[w1][w2][2+offset]*0.2 + 1, parseInt(w1), parseInt(w2)]); // score 0 to 2 not active add 1 to the score TBC not a problem
      else
			  items.push([Stats[w1][w2][0+offset]*0.6 + Stats[w1][w2][1+offset]*0.3 + Stats[w1][w2][2+offset]*0.2, parseInt(w1), parseInt(w2)]); // score 0 to 1, if not active add 1 to the score
		}
	}
	console.log(column);
	if(orderIncrement) // Sort the array based on the second element ordered incrementally
		items.sort(function(first, second){
		  return first[column] - second[column];
		});
	else
		items.sort(function(first, second){
		  return second[column] - first[column];
		});
	
  if(nb == 0)// from start to the end
	  return items.slice(start);

	return items.slice(start, start + nb);
}

// Returns the input array shuffled
function shuffle(array){
  let currentIndex = array.length,  randomIndex;
  // While elements remains to shuffle.
  while(currentIndex != 0){
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]; // swap it with the current element
  }
  return array;
}

// relation 1 to 1 : no word matching with 2 translations
function getGameWords1to1(){
	words = [];
	
  nbWords = 100;
	words_IDs_Score = sort(0, nbWords, 1, 0);
	words1 = {};
	words2 = {};
	relation = {};
	statsIds = [];
	idx = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
	var i = 0;
	//TBC id
  for(var i=0;statsIds.length<20 && i<words_IDs_Score.length;i++){
		w1 = words_IDs_Score[i][1];
		w2 = words_IDs_Score[i][2];
		if(w1 in words1 || w2 in words2 || w2 in relation)
		    continue;
		statsIds.push([w1, w2])
		words1[w1] = null;
		words1[w2] = null;
		for(w2id in Translations[w1])
		    relation[w2id] = null;
	}
  if(statsIds.length!=20){
    nbWords = 200;
    words_IDs_Score = sort(0, nbWords, 1, 0, 2); // take also the inactive to have the 20 words required
    for(var i=0;statsIds.length<20 && i<words_IDs_Score.length;i++){
      w1 = words_IDs_Score[i][1];
      w2 = words_IDs_Score[i][2];
      if(w1 in words1 || w2 in words2 || w2 in relation)
          continue;
      statsIds.push([w1, w2])
      words1[w1] = null;
      words1[w2] = null;
      for(w2id in Translations[w1])
          relation[w2id] = null;
    }
  }
	
	if(gameParam.learntLang < gameParam.masteredLang){
    	for(i=0;i<20;++i){
	    	words.push([statsIds[idx[i]][0], statsIds[idx[i]][1]]); // shuffle
	    }
    }else{
    	for(i=0;i<20;++i){
	    	words.push([statsIds[idx[i]][1], statsIds[idx[i]][0]]);
	    }
    }
	return words;
}

// get new words TODO: To delete
//$("#shuffle").click(getGameWords1to1);

// load more words:
/* unnecessary to update the Stats
let posting = $.post( "getStats.php", { nb_words: 100}, 'json' );

// Put the results in a div
posting.done(function( res ) {
	ans = JSON.parse(res);
	if(Object.keys(ans).length >= 20){
		Stats = ans;
		getGameWords1to1();
		game = new MCQ(words, gameParam);
		game.generateGame();
		$("#disp").hide();
	}else
		displayMSGwithTimeout("Internal error, can't start the game",3000);
});*/

// hardcode langID 1: eng, 3 mon
var gameParam = new GameParameters(1, 3, 0, 0);
/*
getGameWords1to1();
game = new MCQ(words, gameParam);
game.generateGame();
*/
// get new words
/*
let posting = $.post( "getWords.php", { NBofWords: 20, gameParameters: JSON.stringify(gameParam)}, 'json' );

// Put the results in a div
posting.done(function( words ) {
	game = new MCQ(words, gameParam);
	game.generateGame();
});
*/
