var fs = require('fs');

fs.readFile('eune-ranked-5-14.json', 'utf8', function(err, data) {
	if(err)	throw err;
	var matchDetails = JSON.parse(data);
	for(var i = 0; i < matchDetails.length; i++) {
		var key = Object.keys(matchDetails[i])[0];
		matchDetails[i]["id"] = key;
		matchDetails[i]["data"] = matchDetails[i][key];
		delete matchDetails[i][key];
	}	
	fs.writeFile('eune-ranked-5-14.json', JSON.stringify(matchDetails, null, 4), function (err) {
		if (err) throw err;
	  	console.log("file written");
	});
})