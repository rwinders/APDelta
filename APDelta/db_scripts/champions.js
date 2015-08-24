var mongodb = require('mongodb');
var request = require('request');
var fs = require('fs');

var API_KEY = "";

var uri =  "";

fs.readFile('credentials.json', 'utf8', function(err, data) {
	if(err)	throw err;
	var credentials = JSON.parse(data);
	API_KEY = credentials.APIKey;
	uri = credentials.MongoUrl;
	var championsUrl = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=" + API_KEY + "&champData=all";

	request.get({
		url: championsUrl,
		json: true
	}, 
	function(error, response, body) {
		var champKeys = body.keys;
		console.log(champKeys)
		fs.writeFile('champions.json', JSON.stringify(champKeys, null, 4), function (err) {
			if (err) throw err;
		  	console.log("file written");
		});
		/*var championsDataJSON = body.data;
		var championsDataArr = [];
		for(var key in championsDataJSON) {
			championsDataArr.push(championsDataJSON[key]);
		}
		mongodb.MongoClient.connect(uri, function(err, db) {
		  var champions = db.collection('champions');
		  champions.insert(championsDataArr, function(err, result) {
		    if(err) throw err;
		    db.close(function (err) {
		      if(err) throw err;
		    });
		  });
		});*/
	});
})
