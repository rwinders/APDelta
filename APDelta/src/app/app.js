var app = angular.module('APDelta', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider.when('/', {
		controller: 'APDeltaController',
		templateUrl: '/app/partials/apdelta.html'
	});
});