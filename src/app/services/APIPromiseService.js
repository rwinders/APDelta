app.factory('APIPromiseService', [ '$http', function($http) {
	//API CALLS

	function requestDataPromise(url, data) {
		var req = {
			method: 'POST',
			url: url,
			headers: {
				'Content-Type': 'application/json'
			},
			data: data
		}
		return $http(req);
	}

	function genURLGetData() {
		var url = SERVER_URL + "/data";
		return url;
	}

	return {
		getData: function(data) {
			var url = genURLGetData();
			return requestDataPromise(url, data);
		}
	}
}]);