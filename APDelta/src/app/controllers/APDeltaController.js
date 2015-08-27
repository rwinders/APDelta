app.controller('APDeltaController', ['$scope', 'APDeltaService', function($scope, APDeltaService) {
	var data = {
		"id": "1",
		"region": "na",
		"patch": "5-11"
	};

	$scope.getChampions = function() {
		APDeltaService.getChampions();
	}

	$scope.getChampionData = function() {
		APDeltaService.getChampionData(data);
	}

}]);