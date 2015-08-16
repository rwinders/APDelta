app.factory('APIPromiseService', [ '$http', function($http) {
	var API_KEY = "522499d5-cb38-4e8c-a979-adf2526ab310";
	var BASE_URL = "https://na.api.pvp.net/api/lol/";

	//API CALLS
	function requestChampionsPromise(url) {
		var req = {
			method: 'GET',
			url: url,
			headers: {
				'Content-Type': 'json'
			}
		}
		return $http(req);
	}

	//URL HELPER FUNCTIONS
	function genUrlGetChampions() {
		var url = BASE_URL + "static-data/na/v1.2/champion?api_key=" + API_KEY + "&champData=all";
		return url;
	}

	return {
		getChampions: function() {
			var url = genUrlGetChampions();
			return requestChampionsPromise(url);
		}
	}
}]);