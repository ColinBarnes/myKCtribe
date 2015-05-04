angular.module('kcTribeApp.login', ['ngTouch'])

.controller('LoginCtrl', ['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
		$scope.user = {
			email: '',
			password: ''
		};
		$scope.message = '';

		$scope.hasSessionStorage = function () {
			try {
				$window.sessionStorage.setItem('testkey', 'test');
				$window.sessionStorage.removeItem('testkey');
				return true;
			} catch(e) {
				console.log(e);
				return false;
			}
		};

		$scope.login = function () {
			$http
				.post('/authenticate', $scope.user)
				.success(function (data, status, headers, config) {
					// Check if session storage is available
					if( $scope.hasSessionStorage() ) {
						$window.sessionStorage.token = data.token;
						$scope.message = 'Welcome';
						$location.path('/calendar');
					} else {
						$scope.message = "Browser not supported. Make sure you aren't in private mode";
					}
				})
				.error(function (data, status, headers, config) {
					// Erase the token if the user fails to log in
					delete $window.sessionStorage.token;

					// Handle login errors here
					$scope.message = 'Error: Invalid user or password';
				});
	};
}]);