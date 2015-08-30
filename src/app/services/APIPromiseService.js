app.factory('APIPromiseService', [ '$http', function($http) {
	var API_KEY = API_KEY;
	var BASE_URL = "https://na.api.pvp.net/api/lol/";

	//API CALLS
	function requestChampionsPromise(url) {
		var req = {
			method: 'GET',
			url: url,
			headers: {
				'Content-Type': 'application/json'
			}
		}
		return $http(req);
	}

	function requestChampionDataPromise(url, data) {
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

	//URL HELPER FUNCTIONS
	function genUrlGetChampions() {
		var url = BASE_URL + "static-data/na/v1.2/champion?api_key=" + API_KEY + "&champData=all";
		return url;
	}

	function genURLGetChampionData() {
		var url = SERVER_URL + "/champion";
		return url;
	}

	return {
		getChampions: function() {
			var url = genUrlGetChampions();
			return requestChampionsPromise(url);
		},
		getChampionData: function(data) {
			var url = genURLGetChampionData();
			return requestChampionDataPromise(url, data);
		}
	}
}]);