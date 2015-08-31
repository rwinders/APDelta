app.factory('APIPromiseService', [ '$http', function($http) {
	var API_KEY = API_KEY;
	var BASE_URL = "https://na.api.pvp.net/api/lol/";

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