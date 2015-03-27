'use strict';

// Records controller
angular.module('records').controller('RecordsController', ['$scope', '$timeout', '$http', '$stateParams', '$location', 'Authentication', 'Records',
	function($scope, $timeout, $http, $stateParams, $location, Authentication, Records) {
		$scope.authentication = Authentication;
		$scope.showResults = false;
		var timeout;
		// Create new Record
		$scope.create = function() {
			// Create new Record object
			var record = new Records ({
				name: this.name
			});

			// Redirect after save
			record.$save(function(response) {
				$location.path('records/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Record
		$scope.remove = function(record) {
			if ( record ) { 
				record.$remove();

				for (var i in $scope.records) {
					if ($scope.records [i] === record) {
						$scope.records.splice(i, 1);
					}
				}
			} else {
				$scope.record.$remove(function() {
					$location.path('records');
				});
			}
		};

		// Update existing Record
		$scope.update = function() {
			var record = $scope.record;

			record.$update(function() {
				$location.path('records/' + record._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Records
		$scope.find = function() {
			$scope.records = Records.query();
		};

		// Find existing Record
		$scope.findOne = function() {
			$scope.record = Records.get({ 
				recordId: $stateParams.recordId
			});
		};

		// Find member by card_number
		$scope.$watch('card_number', function (newCardNumber) {
			if (newCardNumber) {
				if (timeout) $timeout.cancel(timeout);
				timeout = $timeout(function () {
					$http({
						method: 'GET',
						url: '/members/card/' + newCardNumber
					})
					.success(function (data, err) {
						$scope.member = data;
					});
				},350);
 			}
		});

		// Find inventories by isbn/name/inv_code
		$scope.$watch('keyword', function (newKeyword) {
		   	if (newKeyword) {
				if (timeout) $timeout.cancel(timeout);
				timeout = $timeout(function () {
					$http({
						method: 'GET',
						url: '/inventories/invCode/' + newKeyword
					})
					.success(function (data, err) {
						$scope.inventory = data.data;
					});
				},350);
 			}
		});
	}
]);
