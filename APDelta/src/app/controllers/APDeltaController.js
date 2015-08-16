app.controller('APDeltaController', ['$scope', 'APDeltaService', function($scope, APDeltaService) {
	$scope.getChampions = function() {
		APDeltaService.getChampions();
	}
}]);