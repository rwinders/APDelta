var app = angular.module('APDelta', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider.when('/', {
		controller: 'ItemsController',
		templateUrl: '/app/partials/items.html'
	});
	$routeProvider.when('/champions', {
		controller: 'ChampionsController',
		templateUrl: '/app/partials/champions.html'
	})
});
