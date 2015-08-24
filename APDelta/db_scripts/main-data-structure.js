var mongodb = require('mongodb');
var fs = require('fs');

var mainDataStructure = [];

var champCount = 126;

fs.readFile('champions.json', 'utf8', function(err, data) {
	if(err)	throw err;
	var champObj = JSON.parse(data);
	fs.readFile('items.json', 'utf8', function(err, data) {
		if(err)	throw err;
		var itemObj = JSON.parse(data);
		for(cKey in champObj) {
			var tempObj = {
				"name": champObj[cKey],
				"kills": 0,
				"deaths": 0,
				"assists": 0,
				"visionWardsBought": 0,
				"sightWardsBought": 0,
				"wardsPlaced": 0,
				"goldEarned": 0,
				"wonGames": 0,
				"minionsKilled": 0,
				"neutralMinionsKilled": 0,
				"magicDamageDealt": 0,
				"totalDamageDealt": 0,
				"magicDamageDealtToChampions": 0,
				"totalDamageDealtToChampions": 0,
				"gamesPicked": 0,
				"itemList": {}
			}

			for(iKey in itemObj) {		
				var tempItemObj = {
					"name": itemObj[iKey],
					"buckets": Array.apply(null, Array(320)).map(Number.prototype.valueOf, 0)
				}
				tempObj.itemList[iKey] = tempItemObj;
			}
			console.log(cKey);
			var tempFinalObj = {};
			tempFinalObj[cKey] = tempObj;
			mainDataStructure.push(tempFinalObj);
			if(mainDataStructure.length == champCount) {
				fs.writeFile('main-data-structure.json', JSON.stringify(mainDataStructure, null, 4), function (err) {
					if (err) throw err;
				  	console.log("file written");
				});
			}
		}
	})
})