angular.module('kcTribeApp.event', [])

.controller('EventCtrl', ['$scope', '$routeParams',
	function($scope, $routeParams) {
		$scope.eventId = $routeParams.eventId;
}]);