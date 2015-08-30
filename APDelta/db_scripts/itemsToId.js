var fs = require('fs');

fs.readFile('items.json', 'utf8', function(err, data) {
	var idToChampions = JSON.parse(data);
	var championsToId = {};
	for(id in idToChampions) {
		championsToId[idToChampions[id]] = id;
	}
	fs.writeFile('idToItems.json', JSON.stringify(championsToId, null, 4), function (err) {
		if (err) throw err;
	  	console.log("file written");
	});
})