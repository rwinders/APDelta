var request = require('request');
var fs = require('fs');

var API_KEY = "";

fs.readFile('credentials.json', 'utf8', function(err, data) {
	if(err)	throw err;
	var credentials = JSON.parse(data);
	API_KEY = credentials.APIKey;
	var itemsUrl = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=tags&api_key=" + API_KEY;

	request.get({
		url: itemsUrl,
		json: true
	}, 
	function(error, response, body) {
		var itemData = body.data;
		var itemKeys = {};
		for(var key in itemData) {
			if(itemData[key].tags != null && itemData[key].tags.indexOf("SpellDamage") > -1) {
				itemKeys[key] = itemData[key].name;
			}
		}
		fs.writeFile('items.json', JSON.stringify(itemKeys, null, 4), function (err) {
			if (err) throw err;
		  	console.log("file written");
		});
	});

})
