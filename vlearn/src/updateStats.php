<?php

if(isset($_POST["wordsStats"], $_POST["reverseMode"]))
	//print_r( json_decode($_POST["wordsStats"]));
	echo "\n";
	//echo ($_POST["wordsStats"]);
	//echo "<pre>" . print_r($json, true) . "</pre>";

try{
	$user= "vlearn";
	$pwd = "mnltyu";
	$db = new mysqli('localhost', $user, $pwd, "VocLearn");

	$Stats = json_decode($_POST["wordsStats"]);
	$reverseMode = $_POST["reverseMode"];
	//$Stats = [[w1, w2, 'TN'], ...];

	foreach($Stats as $stat){
		//echo "\n Bbbb \n";
		//print_r($stat);

		$scores = [
			"TP" => 0.5,
			"TN" => 0.2,
			"FP" => 0.0,
			"FN" => 0.0];

		$score = $scores[$stat[2]];
		$w1ID = $stat[0];
		$w2ID = $stat[1];

		if($reverseMode)
			$db->execute_query('UPDATE Stats SET ScoreInv_3 = ScoreInv_2, ScoreInv_2 = ScoreInv_1, ScoreInv_1 = ?, Date = NOW(), HalfLife = CASE WHEN ? > 0 THEN HALF_LIFE*2 ELSE HALF_LIFE END WHERE UserId = 0 AND WordId_1 = ? AND WordId_2 = ?', $score, $score, $w1, $w2);
		else
			$db->execute_query('UPDATE Stats SET Score_3 = Score_2, Score_2 = Score_1, Score_1 = ?, Date = NOW(), HalfLife = CASE WHEN ? > 0 THEN HALF_LIFE*2 ELSE HALF_LIFE END WHERE UserId = 0 AND WordId_1 = ? AND WordId_2 = ?', $score, $score, $w1ID, $w2ID);
		// toggle status of the word active/inactive
		//$db->execute_query('UPDATE Stats SET Status = !Status WHERE UserId = 0 AND WordId_1 = ? AND WordId_2 = ?', $stat);
	}
	//printf("%d\n", $Stats->num_rows);
	//echo count($json)."\n";
	//print_r($json);
	//
	echo "updated";
}catch(Exception $e){
	print $e->getMessage();
}

/*
	Insert or updates the score for the words learnt in learntLang Language.
*/
/* old
function updateScore($db, $user, $wordsStats){
	// a new score lower than the computed average does not lower the score, unless it's 0
	$req = $db->prepare('INSERT INTO Answer(USER, WORD, LANG, DATE, SCORE_1, SCORE) VALUES(:userID, :wordID, :Lang, NOW(), :score, :score*0.5) ON DUPLICATE KEY UPDATE SCORE_3 = SCORE_2, SCORE_2 = SCORE_1, SCORE_1 = CASE WHEN (:score > 0) AND (:score < SCORE_2*0.4 + SCORE_1*0.6) THEN SCORE_2*0.4 + SCORE_1*0.6 ELSE :score END, SCORE = SCORE_1*0.5+SCORE_2*0.3+SCORE_3*0.2, DATE = NOW(), HALF_LIFE = CASE WHEN SCORE = :score AND SCORE > 0 THEN HALF_LIFE*2 ELSE HALF_LIFE END');
	

	foreach($wordsStats as $wordID => $score){
		$answer = ["userID" => $user->id, "Lang" => $user->learntLang, "wordID" => $wordID, "score" => $score];
		$req->execute($answer);
	}
}
 */
