app.controller('ItemsController', ['$scope', 'APDeltaService', function($scope, APDeltaService) {
	$scope.patch = "5-11";
	$scope.region = "na";
	$scope.showTable = false;
	$scope.chartDrawn = false;
	$scope.idToItems = idToItems;
	$scope.itemsToId = itemsToId;
	$scope.item = "Doran's Ring"
	$scope.items = [];
	$scope.itemStats = [];
	$scope.itemData511 = {};
	$scope.itemData514 = {};

	var got511 = false;
	var got514 = false;
	var id = "items";
	var BUCKET_INTERVAL = 15;

	var chart = new google.charts.Bar(document.getElementById('main-item-chart'));

	secondsToMinutes = function(time) {
		var mins = ~~(time / 60);
		var secs = time % 60;

		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;

		ret = "";

		if (hrs > 0)
		    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");

		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}

	$scope.init = function() {
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
		for(item in itemsToId) {
			$scope.items.push({
				"id": itemsToId[item],
				"name": item
			});
		}
		$scope.getItemData511(data511, true);
		$scope.getItemData514(data514, false);
	}

	$scope.getItemData511 = function(data, drawChart) {
		got511 = false;
		APDeltaService.getData(data, drawChart, getItemData511Success, getItemDataFail);
	}

	$scope.getItemData514 = function(data, drawChart) {
		got514 = false;
		APDeltaService.getData(data, drawChart, getItemData514Success, getItemDataFail);
	}

	getItemData511Success = function(data, drawChart) {
		$scope.itemData511 = data;
		got511 = true;
		if(got511 & got514) {
			constructItemStats();
			if($scope.patch == "both") {
				$scope.createItemChart($scope.itemData511.data.itemList[$scope.itemsToId[$scope.item]],
								       $scope.itemData514.data.itemList[$scope.itemsToId[$scope.item]])
			}
		}
		if(drawChart) {
			$scope.createItemChart(data.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	getItemData514Success = function(data, drawChart) {
		$scope.itemData514 = data;
		got514 = true;
		if(got511 && got514) {
			constructItemStats();
			if($scope.patch == "both") {
				$scope.createItemChart($scope.itemData511.data.itemList[$scope.itemsToId[$scope.item]],
								   	   $scope.itemData514.data.itemList[$scope.itemsToId[$scope.item]])
			}
		}
		if(drawChart) {
			$scope.createItemChart(data.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	getItemDataFail = function(error) {
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
		var options = {}
		if ($scope.patch == "5-14") {
			options = {
				colors: ['#F44336']
			}
		}
		chart.draw(chartData, options);
		$scope.chartDrawn = true;
	}

	$scope.changePatch = function() {
		if($scope.patch == "5-11") {
			$scope.createItemChart($scope.itemData511.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else if($scope.patch == "5-14"){
			$scope.createItemChart($scope.itemData514.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else {
			$scope.createItemChart($scope.itemData511.data.itemList[$scope.itemsToId[$scope.item]],
								   $scope.itemData514.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	$scope.changeRegion = function() {
		var data511 = {
			"id": id,
			"region": $scope.region,
			"patch": "5-11"
		}
		var data514 = {
			"id": id,
			"region": $scope.region,
			"patch": "5-14"
		}
		$scope.getItemData511(data511, $scope.patch == "5-11");
		$scope.getItemData514(data514, $scope.patch == "5-14");
	}

	$scope.changeItem = function() {
		if($scope.patch == "5-11") {
			$scope.createItemChart($scope.itemData511.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else if($scope.patch == "5-14"){
			$scope.createItemChart($scope.itemData514.data.itemList[$scope.itemsToId[$scope.item]])
		}
		else {
			$scope.createItemChart($scope.itemData511.data.itemList[$scope.itemsToId[$scope.item]],
								   $scope.itemData514.data.itemList[$scope.itemsToId[$scope.item]])
		}
	}

	constructItemStats = function() {
		$scope.itemStats = [];
		for(item in $scope.itemData511.data.itemList) {
			if($scope.idToItems[item]) {
				var timePurchased511 = 0;
				var timePurchased514 = 0;
				var purchased511 = 0;
				var purchased514 = 0;
				var avgTimePurchased511 = 0;
				var avgTimePurchased514 = 0;
				for(var i = 0; i < $scope.itemData511.data.itemList[item].buckets.length; i++) {
					//console.log($scope.championData511.data.data.itemList[item].buckets[i])
					timePurchased511 += i * 15 * $scope.itemData511.data.itemList[item].buckets[i];
					purchased511 += $scope.itemData511.data.itemList[item].buckets[i];
				}
				for(var i = 0; i < $scope.itemData514.data.itemList[item].buckets.length; i++) {
					timePurchased514 += i * 15 * $scope.itemData514.data.itemList[item].buckets[i];
					purchased514 += $scope.itemData514.data.itemList[item].buckets[i];
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
					"name": $scope.itemData511.data.itemList[item].name, 
					"avgPurchased511": avgTimePurchased511, 
					"avgPurchased514": avgTimePurchased514
				};
				$scope.itemStats.push(entry);
			}
		}
		$scope.showTable = true;
	}

}]);