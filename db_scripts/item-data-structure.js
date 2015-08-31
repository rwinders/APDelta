var mongodb = require('mongodb');
var fs = require('fs');

var mainDataStructure = [];

var champCount = 126;
fs.readFile('kr-ranked-5-14.json', 'utf8', function(err, data) {
	var championsData = JSON.parse(data);
	fs.readFile('items.json', 'utf8', function(err, data) {
		if(err)	throw err;
		var itemObj = JSON.parse(data);
		var itemDataStructure = {
			"id": "items",
			"itemList": {}
		}

		for(iKey in itemObj) {		
			var tempItemObj = {
				"name": itemObj[iKey],
				"buckets": Array.apply(null, Array(320)).map(Number.prototype.valueOf, 0)
			}
			itemDataStructure.itemList[iKey] = tempItemObj;
		}
		
		for(var i = 0; i < championsData.length; i++) {
			for(item in championsData[i].data.itemList) {
				for(var j = 0; j < championsData[i].data.itemList[item].buckets.length; j++) {
					if(itemDataStructure.itemList[item] != null) {
						itemDataStructure.itemList[item].buckets[j] += championsData[i].data.itemList[item].buckets[j];
					}
				}
			}
		}

		fs.writeFile('item-data-structure.json', JSON.stringify(itemDataStructure, null, 4), function (err) {
			if (err) throw err;
		  	console.log("file written");
		});
	})
})
