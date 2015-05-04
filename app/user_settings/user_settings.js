angular.module('kcTribeApp.userSettings', ['ngTouch'])

.controller('UserSettingsCtrl', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
		$scope.firstName = "Bob";
		$scope.lastName = $routeParams.last_name;

		//$http.get('/api/v1/users');
	}
]);