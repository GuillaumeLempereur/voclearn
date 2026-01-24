/*
 * @brief Update the statistic for the words of the Flash Card
 *
 * The result is define as: correct answer: TP True Positive, TN True Negative and wrong answer: FP false positie and FN false negative
 *
 * @param w1 ID of the word (lowest first)
 * @param w2 ID of the word (highest second)
 * @param result one of the 4 possible results [TP, TN, FP, FN]
 *
 * @return stat an array defined as [w1ID, w2ID, result] ex: [0, 65337, "TP"]
 * */
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

// post score TODO
    var posting = $.post("updateStats.php", {wordsStats: JSON.stringify(this.wordsStats)});
    posting.done(function(data){
        //$("#msg").empty().append( data ); // todo : if wrong: connection lost
        console.log(data);
    });
}
