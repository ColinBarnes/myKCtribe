var kcTribeApp = angular.module('kcTribeApp', [
	'ngTouch',
	'ngRoute',
	'kcTribeApp.login',
	'kcTribeApp.calendar',
	'kcTribeApp.event',
	'kcTribeApp.adduser',
	'kcTribeApp.userSettings'
]);

kcTribeApp
	.config(['$routeProvider',
		function ($routeProvider) {
			$routeProvider.
				when('/login',{
					templateUrl: '/app/login/login.html',
					controller: 'LoginCtrl'
				}).
				when('/calendar', {
					templateUrl: '/app/calendar/calendar.html',
					controller: 'CalendarCtrl'
				}).
				when('/event/:eventId', {
					templateUrl: '/app/events/event.html',
					controller: 'EventCtrl'
				}).
				when('/adduser', {
					templateUrl: '/app/adduser/adduser.html',
					controller: 'AddUserCtrl'
				}).
				when('/user_settings', {
					templateUrl: '/app/user_settings/user_settings.html',
					controller: 'UserSettingsCtrl'
				}).
				otherwise({
					redirectTo: '/login'
				});
		}
	])
	// Insert the Authentication token if present
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	});