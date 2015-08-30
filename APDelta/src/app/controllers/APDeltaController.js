app.controller('APDeltaController', ['$scope', '$rootScope', 'APDeltaService', function($scope, $rootScope, APDeltaService) {
	$scope.idToChampions = idToChampions;
	$scope.championsToId = championsToId;
	$scope.champions = [];

	$scope.init = function() {
		for(champion in $scope.championsToId) {
			$scope.champions.push(champion);
		}
	}

	$scope.createItemChart = function(champion) {
		var id = championsToId[champion];
		setTimeout(function() { $rootScope.$broadcast('championClicked', id); }, 100);
	}

}]);