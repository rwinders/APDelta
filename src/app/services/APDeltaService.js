app.factory('APDeltaService', ['APIPromiseService', function(APIPromiseService) {
	return {
		getData: function(data, drawChart, successCallback, failCallback) {
			APIPromiseService.getData(data)
				.then(function(data) {
					successCallback(data, drawChart);
				}, function(error) {
					failCallback(error);
				});
		}
	}
}]);