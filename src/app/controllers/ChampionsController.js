app.controller('ChampionsController', ['$scope', '$rootScope', 'APDeltaService', function($scope, $rootScope, APDeltaService) {
	$scope.championData511 = {};
	$scope.chanpionData514 = {};
	$scope.currentChampion = null;
	$scope.currentId = "";
	$scope.patch = "5-11";
	$scope.region = "na";
	$scope.stats = [];
	$scope.showTable = false;
	$scope.chartDrawn = false;
	$scope.idToItems = idToItems;
	$scope.itemsToId = itemsToId;
	$scope.item = "Doran's Ring"
	$scope.itemStats = [];

	var got511 = false;
	var got514 = false;

	var BUCKET_INTERVAL = 15;
	var chart = new google.charts.Bar(document.getElementById('item-chart'));

	secondsToMinutes = function(time) {
		// var minutes = Math.floor(time / 60);
		// var seconds = time - minutes * 60;
		// if(seconds == 0) {
		// 	seconds = "00"
		// }
		// return minutes + ":" + seconds;
		// Minutes and seconds
		var mins = ~~(time / 60);
		var secs = time % 60;

		// Hours, minutes and seconds
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;

		// Output like "1:01" or "4:03:59" or "123:03:59"
		ret = "";

		if (hrs > 0)
		    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");

		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}

	$scope.$on('championClicked', function (event, id) {
		$scope.currentChampion = idToChampions[id];
		$scope.currentId = id;
		$scope.chartDrawn = false;
		$scope.stats = [];
		$scope.itemStats = [];
		$scope.showTable = false;
		var data511 = {
			"id": id,
			"region": "na",
			"patch": "5-11"
		}
		var data514 = {
			"id": id,
			"region": "na",
			"patch": "5-14"
		}
		$scope.getChampionData511(data511, true);
		$scope.getChampionData514(data514, false);
	});

	$scope.getChampionData511 = function(data, drawChart) {
		got511 = false;
		APDeltaService.getChampionData(data, drawChart, getChampionData511Success, getChampionDataFail);
	}

	$scope.getChampionData514 = function(data, drawChart) {
		got514 = false;
		APDeltaService.getChampionData(data, drawChart, getChampionData514Success, getChampionDataFail);
	}

	getChampionData511Success = function(data, drawChart) {
		$scope.championData511 = data;
		got511 = true;
		$scope.stats = [];
		if(got511 & got514) {
			constructStats();
			constructItemStats();
		}
		if(drawChart) {
			$scope.createItemChart(data.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	getChampionData514Success = function(data, drawChart) {
		$scope.championData514 = data;
		got514 = true;
		$scope.stats = [];
		if(got511 && got514) {
			constructStats();
			constructItemStats();
		}
		if(drawChart) {
			$scope.createItemChart(data.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	getChampionDataFail = function(error) {
		console.log("failed to get champion data");
	}

	$scope.createItemChart = function(itemList1, itemList2) {
		var itemBuckets1 = itemList1.buckets;
		if(itemList2) {
			var itemBuckets2 = itemList2.buckets;
			var dataArray = [['Time', '5.11 Purchases', "5.14 Purchases"]];
		}
		else {
			var dataArray = [['Time', 'Purchases']];
		}
		for(var i = 0; i < itemBuckets1.length - 80; i++) {
			var time = secondsToMinutes(i * BUCKET_INTERVAL);
			if(itemList2) {
				var entry = [time, itemBuckets1[i], itemBuckets2[i]]
			}
			else {
				var entry = [time, itemBuckets1[i]];
			}
			dataArray.push(entry);
		}
		var chartData = google.visualization.arrayToDataTable(dataArray);
		var options = {
			chart: {
				title: itemList1.name
			},
			animation: {
				duration: 1000,
				easing: "in",
			}
		}
		chart.draw(chartData, options);
		$scope.chartDrawn = true;
	}



	$scope.changePatch = function() {
		if($scope.patch == "5-11") {
			$scope.createItemChart($scope.championData511.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else if($scope.patch == "5-14"){
			$scope.createItemChart($scope.championData514.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else {
			$scope.createItemChart($scope.championData511.data.data.itemList[$scope.itemsToId[$scope.item]],
								   $scope.championData514.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	$scope.changeRegion = function() {
		var data511 = {
			"id": $scope.currentId,
			"region": $scope.region,
			"patch": "5-11"
		}
		var data514 = {
			"id": $scope.currentId,
			"region": $scope.region,
			"patch": "5-14"
		}
		$scope.getChampionData511(data511, $scope.patch == "5-11");
		$scope.getChampionData514(data514, $scope.patch == "5-14");
	}

	$scope.changeItem = function() {
		if($scope.patch == "5-11") {
			$scope.createItemChart($scope.championData511.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else if($scope.patch == "5-14"){
			$scope.createItemChart($scope.championData514.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else {
			$scope.createItemChart($scope.championData511.data.data.itemList[$scope.itemsToId[$scope.item]],
								   $scope.championData514.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	$scope.statIcon = function(stat511, stat514) {
		return stat511 > stat514;
	}

	constructItemStats = function() {
		for(item in $scope.championData511.data.data.itemList) {
			if($scope.idToItems[item]) {
				var timePurchased511 = 0;
				var timePurchased514 = 0;
				var purchased511 = 0;
				var purchased514 = 0;
				var avgTimePurchased511 = 0;
				var avgTimePurchased514 = 0;
				for(var i = 0; i < $scope.championData511.data.data.itemList[item].buckets.length; i++) {
					//console.log($scope.championData511.data.data.itemList[item].buckets[i])
					timePurchased511 += i * 15 * $scope.championData511.data.data.itemList[item].buckets[i];
					purchased511 += $scope.championData511.data.data.itemList[item].buckets[i];
				}
				for(var i = 0; i < $scope.championData514.data.data.itemList[item].buckets.length; i++) {
					timePurchased514 += i * 15 * $scope.championData514.data.data.itemList[item].buckets[i];
					purchased514 += $scope.championData514.data.data.itemList[item].buckets[i];
				}
				
				if(purchased511 == 0) {
					avgTimePurchased511 = "Never Purchased";
				}
				else {
					avgTimePurchased511 = secondsToMinutes(Math.round(timePurchased511 / purchased511));
				}

				if(purchased514 == 0) {
					avgTimePurchased514 = "Never Purchased";
				}
				else {
					avgTimePurchased514 = secondsToMinutes(Math.round(timePurchased514 / purchased514));
				}
				var entry = {
					"name": $scope.championData511.data.data.itemList[item].name, 
					"avgPurchased511": avgTimePurchased511, 
					"avgPurchased514": avgTimePurchased514
				};
				$scope.itemStats.push(entry);
			}
		}
	}

	constructStats = function() {
		$scope.stats.push({
			"stat": "Kills",
			"5-11": ($scope.championData511.data.data.kills / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.kills / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Deaths",
			"5-11": ($scope.championData511.data.data.deaths / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.deaths / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Assists",
			"5-11": ($scope.championData511.data.data.assists / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.assists / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Green Wards Purchased",
			"5-11": ($scope.championData511.data.data.sightWardsBought / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.sightWardsBought / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Pink Wards Purchased",
			"5-11": ($scope.championData511.data.data.visionWardsBought / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.visionWardsBought / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Wards Placed",
			"5-11": ($scope.championData511.data.data.wardsPlaced / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.wardsPlaced / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Gold Earned",
			"5-11": ($scope.championData511.data.data.goldEarned / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.goldEarned / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Minions Killed",
			"5-11": ($scope.championData511.data.data.minionsKilled / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.minionsKilled / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Neutral Minions Killed",
			"5-11": ($scope.championData511.data.data.neutralMinionsKilled / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.neutralMinionsKilled / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Magic Damage Dealt",
			"5-11": ($scope.championData511.data.data.magicDamageDealt / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.magicDamageDealt / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Total Damage Dealt",
			"5-11": ($scope.championData511.data.data.totalDamageDealt / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.totalDamageDealt / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Magic Damage Dealt To Champions",
			"5-11": ($scope.championData511.data.data.magicDamageDealtToChampions / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.magicDamageDealtToChampions / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Total Damage Dealt To Champions",
			"5-11": ($scope.championData511.data.data.totalDamageDealtToChampions / $scope.championData511.data.data.gamesPicked).toFixed(2),
			"5-14": ($scope.championData514.data.data.totalDamageDealtToChampions / $scope.championData514.data.data.gamesPicked).toFixed(2)
		})
		$scope.stats.push({
			"stat": "Pick Rate",
			"5-11": ((($scope.championData511.data.data.gamesPicked / totalGames[$scope.region + "-" + $scope.patch]) * 100).toFixed(2)) + "%",
			"5-14": ((($scope.championData514.data.data.gamesPicked / totalGames[$scope.region + "-" + $scope.patch]) * 100).toFixed(2)) + "%"
		})
		$scope.stats.push({
			"stat": "Win Rate",
			"5-11": ((($scope.championData511.data.data.wonGames / $scope.championData511.data.data.gamesPicked) * 100).toFixed(2)) + "%",
			"5-14": ((($scope.championData514.data.data.wonGames / $scope.championData514.data.data.gamesPicked) * 100).toFixed(2)) + "%"
		})
		$scope.showTable = true;
	}

}]);