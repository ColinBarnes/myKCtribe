angular.module('kcTribeApp.calendar', ['ngTouch'])

.controller('CalendarCtrl', ['$scope', '$http', '$filter',
	function ($scope, $http, $filter) {

		$scope.newEvent = {};
		$scope.refDate = new Date(); // The selected date on the calendar

		// Create a list of times to use when scheduling a new event
		$scope.times = [];
		var hours = new Date(114, 0, 1, 0, 0, 0);
		for(var i=0; i < 48; i++) {
			$scope.times.push($filter('date')(hours, 'h:mm a'));
			hours.setMinutes(hours.getMinutes() + 30);
		}

		// Pre-populate the new event
		$scope.newEvent.start_day = $filter('date')($scope.refDate, 'M/d/yy');
		$scope.newEvent.start_time = $scope.times[38];
		$scope.newEvent.end_day = $filter('date')($scope.refDate, 'M/d/yy');
		$scope.newEvent.end_time = $scope.times[40];

		// Change the date for adding an event when the date on the reference date changes
		$scope.$watch('refDate', function(newVal,oldVal){
			$scope.newEvent.start_day = $filter('date')($scope.refDate, 'M/d/yy');
			$scope.newEvent.end_day = $filter('date')($scope.refDate, 'M/d/yy');
		});

		// Change the end time so that it's not before the start time
		$scope.$watch('newEvent.start_time', function (newVal, oldVal) {
			console.log('newVal is:');
			console.log(newVal);
			console.log('');
			if(($scope.newEvent.start_day === $scope.newEvent.end_day) && (newVal > $scope.newEvent.end_time)) {
				$scope.newEvent.end_time = $scope.times[$scope.times.indexOf(newVal) + 2];
			}
		}, true);

		// Shorten the summary to <140 characters.
		// Don't cut off in the middle of a word.
		var shortSummary =  function (summary) {
			var i = 140;
			if (summary.length > 140){
				while(summary[i] != ' ') {
					i--;
				}
			}

			return summary.substr(0, i);
		};
		
		// Get all of the events
		$http.get('/api/v1/events')
			.success(function (res) {
				console.log("Print res before filtering");
				console.log(res);
				res.forEach(function (event) {
					event.summary= shortSummary(event.summary);
					event.start = new Date(event.start);
					event.end = new Date(event.end);
				});

				console.log("Print res after filtering");
				console.log(res);

				$scope.events = res;

				console.log("Print scope.events: ");
				console.log($scope.events);
		});

		// Create a list of dates, one for each day where there is an event
		$scope.$watch('events', function(oldVal, newVal){
			console.log('Date list recreated');
			$scope.dates = [];
			for(var i in $scope.events) {
				if($scope.dates.indexOf($scope.events[i].start) === -1) {
					$scope.dates.push($scope.events[i].start.toLocaleDateString());
				}
			}
		});

		// True when Add Event is selected
		$scope.addEventToggle = false;

		$scope.toggleAddEvent = function() {
			$scope.addEventToggle = !$scope.addEventToggle;
		};

		// Filter to determine if a date is in the future
		$scope.futureDates = function(event) {
			return event.start >= $scope.refDate;
		};

		// This would be part of a service
		$scope.addEvent = function() {
			var data = {
				dt_start: new Date($scope.newEvent.start_day + " " + $scope.newEvent.start_time),
				dt_end:new Date($scope.newEvent.end_day + " " + $scope.newEvent.end_time),
				summary: $scope.newEvent.summary,
				description: $scope.newEvent.description,
				location: $scope.newEvent.location
			};
			$http.post('/api/v1/events', data)
				.success(function (data, status) {
					console.log("success");
					console.log(status);
				})
				.error(function (data, status) {
					console.log("error");
					console.log(status);
				});
			$scope.events.push($scope.newEvent);
			$scope.newEvent = {};
			$scope.addEventToggle = false;
		};
}])

.directive('kcCalendar', function(){
	return {
		restrict: 'E',
		replace: 'true',
		templateUrl: "/app/calendar/templates/kccalendar.html",
		scope:{
			refDay: '=',
			highlightedDays: '='
		},
		link: function(scope, elem, attrs) {
			/******************
			*  View Functions *
			*******************/


			// Set the reference day to the one selected from the calendar
			scope.setDate = function(day) {
				scope.refDay = new Date(day);
			};

			// Switch the reference day to the same time last month
			scope.lastMonth = function() {
				scope.refDay = new Date(scope.refDay.getFullYear(), scope.refDay.getMonth() - 1, scope.refDay.getDate());
			};

			// Switch the reference day to the same time next month
			scope.nextMonth = function() {
				scope.refDay = new Date(scope.refDay.getFullYear(), scope.refDay.getMonth() + 1, scope.refDay.getDate());
			};

			/******************
			* Watch Functions *
			*******************/

			// If the reference day changes, redraw the calendar
			scope.$watch('refDay', function(newVal, oldVal) {
				if(newVal.toLocaleDateString() != oldVal.toLocaleDateString()) {
					createCalendar();
				}
			});

			scope.$watch('highlightedDays', function(newVal, oldVal) {
				createCalendar();
			});

			createCalendar = function() {
				scope.weeks = [];
				scope.daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				var febLength =0,
					lastMonthDays = 0,
					numWeeks = 0,
					i = 0,
					j = 0,
					daysPerMonth = [],
					weeks = [],
					calDate,
					firstOfMonth;

				// Determine if it's a leap year
				if((scope.refDay.getYear() % 4 === 0 && scope.refDay.getFullYear() % 100 !== 0) || scope.refDay.getYear() % 400 === 0 ) {
					febLength = 29;
				} else {
					febLength = 28;
				}

				daysPerMonth = [31, febLength, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

				// First date of the month
				firstOfMonth = new Date(scope.refDay.getFullYear(), scope.refDay.getMonth(), 1);

				// Number of days from last month to put on calendar
				lastMonthDays = firstOfMonth.getDay();

				// Starting date of the calendar
				calDate = new Date(scope.refDay.getFullYear(), scope.refDay.getMonth(), 1-lastMonthDays);

				// Number of weeks in this month
				numWeeks = Math.ceil((lastMonthDays + daysPerMonth[scope.refDay.getMonth()])/7);

				for(i=0; i<numWeeks; i++) {
					scope.weeks.push([]);
					for(j=0; j<7; j++) {
						scope.weeks[i].push({
							differentMonth: calDate.getMonth() !== scope.refDay.getMonth(),
							date: calDate,
							selected: calDate.toLocaleDateString() === scope.refDay.toLocaleDateString(),
							highlighted: scope.highlightedDays.indexOf(calDate.toLocaleDateString()) != -1
						});
						calDate = new Date(calDate.getFullYear(), calDate.getMonth(), calDate.getDate()+1);
					}
				}
			};

			createCalendar();
		}
	};
});