var mongodb = require('mongodb');
var request = require('request');
var fs = require('fs');

var API_KEY = "";
var MATCHES_COUNT = 100;

var uri =  "";

var match_ids;
var match_details = [];
var current_match = 0;

var items = "";
var champions = "";
var main_data_structure = "";

fs.readFile('credentials.json', 'utf8', function(err, data) {
	if(err)	throw err;
	console.log("Read credentials.json")
	var credentials = JSON.parse(data);
	API_KEY = credentials.APIKey;
	uri = credentials.MongoUrl;
	var matchUrl = "https://na.api.pvp.net/api/lol/na/v2.2/match/1852538938?api_key=" + API_KEY;

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
				
				fs.readFile('match_ids/5.11/RANKED_SOLO/NA.json', 'utf8', function(err, data) {
					if(err)	throw err;
					console.log("Read NA.json")
					match_ids = JSON.parse(data);
					for(var i = 0; i < MATCHES_COUNT; i++) {
						var matchUrl = "https://na.api.pvp.net/api/lol/na/v2.2/match/" + match_ids[i]  + "?api_key=" + API_KEY + "&includeTimeline=true";
						matchTimeout(i, matchUrl);
					}
				})
			})
		})
	})
})


function matchRequest(matchNumber, url) {
	console.log("Sending request for match " + matchNumber + " : " + url);
	request.get({
		url: url,
		json: true
	}, 
	function(error, response, body) {
		var matchDetail = body;
		var frames = matchDetail.timeline.frames;
		var participants = matchDetail.participants;
		updatePicked();
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
				particpantsAP[purchaseAPEvents[i].participantId].items.push(purchaseAPEvents[i]);
			}
		}

		for(participant in participantsAP) {
			for(var i = 0; i < main_data_structure.length; i++) {
				if(main_data_structure[i][participant.championId] != null) {
					main_data_structure[i][participant.championId].kills += participant.stats.kills;
					main_data_structure[i][participant.championId].deaths += participant.stats.deaths;
					main_data_structure[i][participant.championId].assists += participant.stats.assists;
					main_data_structure[i][participant.championId].visionWardsBought += participant.stats.visionWardsBoughtInGame;
					main_data_structure[i][participant.championId].sightWardsBought += participant.stats.sightWardsBoughtInGame;
					main_data_structure[i][participant.championId].wardsPlaced += participant.stats.wardsPlaced;
					main_data_structure[i][participant.championId].goldEarned += participant.stats.goldEarned;
					main_data_structure[i][participant.championId].minionsKilled += participant.stats.minionsKilled;
					main_data_structure[i][participant.championId].neutralMinionsKilled += participant.stats.neutralMinionsKilled;
					main_data_structure[i][participant.championId].magicDamageDealt += participant.stats.magicDamageDealt;
					main_data_structure[i][participant.championId].totalDamageDealt += participant.stats.totalDamageDealt;
					main_data_structure[i][participant.championId].magicDamageDealtToChampions += participant.stats.magicDamageDealtToChampions;
					main_data_structure[i][participant.championId].totalDamageDealtToChampions += participant.stats.totalDamageDealtToChampions;
					if(participant.stats.winner == true) {
						main_data_structure[i][participant.championId].wonGames += 1;
					}

					for(j = 0; j < participant.items.length; j++) {
						//update item list with new item purchases.
					}
				}
			}
		}
		/*match_details.push(body);
		current_match++;
		if(current_match === MATCHES_COUNT) {
			console.log(match_details);
		}*/
	});
}

function matchTimeout(i, url) {
	setTimeout(function() { matchRequest(url, i) }, i * 1250);
}

function isAPItem(itemId) {
	if(items.itemId != null) {
		return true;
	}
	else {
		return false;
	}
}

function updatePicked(participants) {
	for(var i = 0; i < main_data_structure.length; i++) {
		for(var j = 0; j < participants.length; j++) {
			if(main_data_structure[i][participants.participantId] != null) {
				main_data_structure[i][participants.participantId].gamesPicked++;
			}
		}
	}
}