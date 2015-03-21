'use strict';

// Records controller
angular.module('records').controller('RecordsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Records',
	function($scope, $stateParams, $location, Authentication, Records) {
		$scope.authentication = Authentication;

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
	}
]);