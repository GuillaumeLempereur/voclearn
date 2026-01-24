<?php
/*
 * get stats
 * TODO handle multi user: filter on user
 * */
header('Content-Type: application/javascript');

$user= "vlearn";
$pwd = "mnltyu";

try{
	$stats = [];
	$userId = 0; $db = new mysqli('localhost', $user, $pwd, "VocLearn");
	$StatsReq = $db->query("SELECT WordId_1, WordId_2, Score_1, Score_2, Score_3, ScoreInv_1, ScoreInv_2, ScoreInv_3, Status FROM Stats WHERE UserId = $userId");
	//$StatsReq = $db->query("SELECT WordId_1, WordId_2, Score_1, Score_2, Score_3, ScoreInv_1, ScoreInv_2, ScoreInv_3, Date, HalfLife, Status FROM Stats WHERE UserId = $userId");
	
	$stats = []; // [[w1, w2, satus], ...]
	while($row = $StatsReq->fetch_assoc()){
		//echo join(", ", $row)."\n";
		$row = array_values($row);
		$stats[] = [strval($row[0]), strval($row[1]), $row[2]];
		//$stats[strval($row[0])][$row[1]] = json_encode(array_slice($row, 2), JSON_NUMERIC_CHECK);

		/*foreach($row as $k => $v)
			$stat[] = $v;
		$json[$stat[0]][$stat[1]] = array_slice($stat, 2);
		 */
	}
	//printf("%d\n", $Stats->num_rows);
	//echo count($json)."\n";
	/*
	$m = 0;
	foreach($stats as $stat)
		$m = max(count($stat),$m);
	 */
	//print_r($stats);
	echo json_encode((object)$stats, JSON_NUMERIC_CHECK);//, JSON_FORCE_OBJECT | );
}catch(Exception $e){
	echo($e);
}

