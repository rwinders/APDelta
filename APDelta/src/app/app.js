var app = angular.module('APDelta', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider.when('/', {
		controller: 'APController',
		templateUrl: '/app/partials/apdelta.html'
	});
});