angular.module('kcTribeApp.adduser', [])

.controller('AddUserCtrl', function ($scope) {
	$scope.addUser = function () {
		$http.post('/api/v1/adduser', $scope.email)
			.success(function (data, status, headers, config) {
				console.log("Successfully added user.");
			});
	};
});