'use strict';
const fs = require('fs');
const readline = require('readline');
//ストリーム(流れ)を生成する
const rs = fs.createReadStream('./popu-pref.csv');
//流れを行単位でまとめる      
const rl = readline.createInterface( { input : rs } );
//key:都道府県  value:集計データのオブジェクト
const prefectureDateMap = new Map();    
//１行読み終わったら
rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if(year === 2010 || year === 2015) {
        let value = null;
        if(prefectureDateMap.has(prefecture)) {
            value = prefectureDateMap.get(prefecture);
        } else {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if(year === 2010) {
            value.popu10 = popu;
        }
        if(year === 2015) {
            value.popu15 = popu;
        }
        prefectureDateMap.set(prefecture, value);
    }
});
//読み取り動作が終わったら
rl.on('close', () => {
    for (const [key, value] of prefectureDateMap) {
        value.change = value.popu15 / value.popu10;
    }
    //デバッグ
    // console.log(Array.from(prefectureDateMap));
    //連想配列prefectureDateMapを普通の配列に変換したあと変化率を使って並び替え
    const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // console.log(rankingArray);
    //集計結果を見やすくする
    const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`;
    })
    console.log(rankingStrings);
});