var mongodb = require('mongodb');
var fs = require('fs');

var uri =  "";
var collection = "euw-ranked-5-14"

fs.readFile('credentials.json', 'utf8', function(err, data) {
	if(err)	throw err;
	var credentials = JSON.parse(data);
	fs.readFile('euw-ranked-5-14.json', 'utf8', function(err, data) {
		if(err)	throw err;
		var matchDetails = JSON.parse(data);
		uri = credentials.MongoUrl;
		mongodb.MongoClient.connect(uri, function(err, db) {
		  var matches = db.collection(collection);
		  matches.insert(matchDetails, function(err, result) {
		    if(err) throw err;
		    db.close(function (err) {
		      if(err) throw err;
		      console.log("stored in db")
		    });
		  });
		});
	})
})
