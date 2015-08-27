var mongodb = require('mongodb');
var request = require('request');
var fs = require('fs');

var API_KEY = "";
var MATCH_START = 0;
var MATCHES_END = 10000;

var uri =  "";

var match_ids;
var match_details = [];
var current_match = 0;
var matches_with_timeline = 0;

var items = "";
var champions = "";
var main_data_structure = "";

fs.readFile('credentials.json', 'utf8', function(err, data) {
	if(err)	throw err;
	console.log("Read credentials.json")
	var credentials = JSON.parse(data);
	API_KEY = credentials.APIKey;
	uri = credentials.MongoUrl;

	fs.readFile('items.json', 'utf8', function(err, data) {
		if(err)	throw err;
		console.log("Read items.json");
		items = JSON.parse(data);
		
		fs.readFile('champions.json', 'utf8', function(err, data) {
			if(err)	throw err;
			console.log("Read champions.json")
			champions = JSON.parse(data);

			fs.readFile('main-data-structure.json', 'utf8', function(err, data) {
				if(err)	throw err;
				console.log("Read main-data-structure.json")
				main_data_structure = JSON.parse(data);
				
				fs.readFile('match_ids/5.11/RANKED_SOLO/KR.json', 'utf8', function(err, data) {
					if(err)	throw err;
					console.log("Read NA.json")
					match_ids = JSON.parse(data);
					for(var i = MATCH_START; i < MATCHES_END; i++) {
						var matchUrl = "https://kr.api.pvp.net/api/lol/kr/v2.2/match/" + match_ids[i]  + "?api_key=" + API_KEY + "&includeTimeline=true";
						matchTimeout(i - MATCH_START, matchUrl);
					}
				})
			})
		})
	})
})


function matchRequest(matchNumber, url) {
	console.log("Sending request for match " + (matchNumber + MATCH_START) + " : " + url);
	request.get({
		url: url,
		json: true
	}, 
	function(error, response, body) {
		var matchDetail = body;
		if (matchDetail != null && matchDetail.timeline != null) {
			matches_with_timeline++;
			var frames = matchDetail.timeline.frames;
			var participants = matchDetail.participants;
			updatePicked(participants);
			var purchaseAPEvents = [];
			var participantsAP = {};
			for(var i = 0; i < frames.length; i++) {
				if(frames[i].events != null) {
					for(var j = 0; j < frames[i].events.length; j++) {
						if(frames[i].events[j].eventType == "ITEM_PURCHASED" && isAPItem(frames[i].events[j].itemId)) {
							purchaseAPEvents.push(frames[i].events[j]);
						}
					}
				}
			}

			for(var i = 0; i < purchaseAPEvents.length; i++) {
				if(participantsAP[purchaseAPEvents[i].participantId] == null) {
					for(var j = 0; j < participants.length; j++) {
						if(purchaseAPEvents[i].participantId == participants[j].participantId) {
							participantsAP[purchaseAPEvents[i].participantId] = {
								"championId": participants[j].championId,
								"stats": participants[j].stats,
								"items": [purchaseAPEvents[i]]
							}
						}
					}
				}
				else {
					participantsAP[purchaseAPEvents[i].participantId].items.push(purchaseAPEvents[i]);
				}
			}


			for(participant in participantsAP) {
				for(var i = 0; i < main_data_structure.length; i++) {
					if(main_data_structure[i][participantsAP[participant].championId] != null) {
						main_data_structure[i][participantsAP[participant].championId].kills += participantsAP[participant].stats.kills;
						main_data_structure[i][participantsAP[participant].championId].deaths += participantsAP[participant].stats.deaths;
						main_data_structure[i][participantsAP[participant].championId].assists += participantsAP[participant].stats.assists;
						main_data_structure[i][participantsAP[participant].championId].visionWardsBought += participantsAP[participant].stats.visionWardsBoughtInGame;
						main_data_structure[i][participantsAP[participant].championId].sightWardsBought += participantsAP[participant].stats.sightWardsBoughtInGame;
						main_data_structure[i][participantsAP[participant].championId].wardsPlaced += participantsAP[participant].stats.wardsPlaced;
						main_data_structure[i][participantsAP[participant].championId].goldEarned += participantsAP[participant].stats.goldEarned;
						main_data_structure[i][participantsAP[participant].championId].minionsKilled += participantsAP[participant].stats.minionsKilled;
						main_data_structure[i][participantsAP[participant].championId].neutralMinionsKilled += participantsAP[participant].stats.neutralMinionsKilled;
						main_data_structure[i][participantsAP[participant].championId].magicDamageDealt += participantsAP[participant].stats.magicDamageDealt;
						main_data_structure[i][participantsAP[participant].championId].totalDamageDealt += participantsAP[participant].stats.totalDamageDealt;
						main_data_structure[i][participantsAP[participant].championId].magicDamageDealtToChampions += participantsAP[participant].stats.magicDamageDealtToChampions;
						main_data_structure[i][participantsAP[participant].championId].totalDamageDealtToChampions += participantsAP[participant].stats.totalDamageDealtToChampions;
						if(participantsAP[participant].stats.winner == true) {
							main_data_structure[i][participantsAP[participant].championId].wonGames += 1;
						}

						for(var j = 0; j < participantsAP[participant].items.length; j++) {
							//update item list with new item purchases.
							main_data_structure[i][participantsAP[participant].championId].itemList[participantsAP[participant].items[j].itemId].buckets[Math.floor((participantsAP[participant].items[j].timestamp) / 15000)] += 1;
						}
					}
				}
			}
		}
		else {
			console.log("timeline null for match: " + matchNumber);
		}

		if(matchNumber + MATCH_START === MATCHES_END - 1) {
			fs.writeFile('main-data-structure.json', JSON.stringify(main_data_structure, null, 4), function (err) {
				if (err) throw err;
				console.log("total matches analyzed: " + matches_with_timeline);
			  	console.log("file written");
			});
		}


		/*match_details.push(body);
		current_match++;
		if(current_match === MATCHES_COUNT) {
			console.log(match_details);
		}*/
	});
}

function matchTimeout(i, url) {
	setTimeout(function() { matchRequest(i, url) }, i * 1300);
}

function isAPItem(itemId) {
	if(items[itemId] != null) {
		return true;
	}
	else {
		return false;
	}
}

function updatePicked(participants) {
	for(var i = 0; i < main_data_structure.length; i++) {
		for(var j = 0; j < participants.length; j++) {
			if(main_data_structure[i][participants[j].championId] != null) {
				main_data_structure[i][participants[j].championId].gamesPicked++;
			}
		}
	}
}