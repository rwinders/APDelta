app.controller('ChampionsController', ['$scope', '$rootScope', 'APDeltaService', function($scope, $rootScope, APDeltaService) {
	$scope.championData511 = {};
	$scope.chanpionData514 = {};
	$scope.currentChampion = "";
	$scope.currentId = "";
	$scope.patch = "5-11";
	$scope.region = "na";
	$scope.stats = [];
	$scope.showTable = false;
	$scope.chartDrawn = false;
	$scope.idToItems = idToItems;
	$scope.itemsToId = itemsToId;
	$scope.item = "Doran's Ring"

	var got511 = false;
	var got514 = false;

	var BUCKET_INTERVAL = 15;
	var chart = new google.charts.Bar(document.getElementById('item-chart'));

	secondsToMinutes = function(time) {
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		if(seconds == 0) {
			seconds = "00"
		}
		return minutes + ":" + seconds;
	}

	$scope.$on('championClicked', function (event, id) {
		$scope.currentChampion = idToChampions[id];
		$scope.currentId = id;
		$scope.chartDrawn = false;
		$scope.stats = [];
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
		}
		if(drawChart) {
			$scope.createItemChart(data.data.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	getChampionDataFail = function(error) {
		console.log("failed to get champion data");
	}

	$scope.createItemChart = function(itemList) {
		var dataArray = [['Time', 'Purchases']];
		var itemBuckets = itemList.buckets;
		for(var i = 0; i < itemBuckets.length; i++) {
			var time = secondsToMinutes(i * BUCKET_INTERVAL);
			var entry = [time, itemBuckets[i]];
			dataArray.push(entry);
		}
		var chartData = google.visualization.arrayToDataTable(dataArray);
		var options = {
			chart: {
				title: itemList.name
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
		else {
			$scope.createItemChart($scope.championData514.data.data.itemList[$scope.itemsToId[$scope.item]])
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
		else {
			$scope.createItemChart($scope.championData514.data.data.itemList[$scope.itemsToId[$scope.item]])
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
			"stat": "Win Rate",
			"5-11": ((($scope.championData511.data.data.wonGames / $scope.championData511.data.data.gamesPicked) * 100).toFixed(2)) + "%",
			"5-14": ((($scope.championData514.data.data.wonGames / $scope.championData514.data.data.gamesPicked) * 100).toFixed(2)) + "%"
		})
		$scope.showTable = true;
	}

}]);