'use strict';

// Records controller
angular.module('records').controller('RecordsController', ['$scope', '$timeout', '$http', '$stateParams', '$location', 'Authentication', 'Records',
	function($scope, $timeout, $http, $stateParams, $location, Authentication, Records) {
		$scope.authentication = Authentication;
		$scope.showResults = false;
		$scope.inventories=[];
		$scope.select_inventories=[];
        
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
					$scope.member_invalid_msg = '';
					$scope.member = null;
					$http({
						method: 'GET',
						url: '/members/card/' + newCardNumber
					})
					.success(function (data, err) {
						$scope.member = data;
                        $scope.max_book = data.max_book || 4;

                        // TODO: need to finish.
                        // $scope.on_rent_book = Records.find({
                        //     member: $scope.member,
                        //     isRent: true
                        // }).count();

                        var a_d_ms = new Date($scope.member.active_time).getTime();
                        var v_d_ms = a_d_ms + $scope.member.valid_days * 24 * 3600 * 1000;
                        
                        if (Date.now() > v_d_ms) {
                            $scope.member_invalid_msg = '会员卡到期';
                        } else if ($scope.member.isLocked) {
                            $scope.member_invalid_msg = '该会员已经被冻结';
                        } else {
                            $scope.member_invalid_msg = '';
                        }

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
						$scope.inventories.push(data);
						$scope.keyword = '';
					});
				},350);
 			}
		});

		// select the inventory
		$scope.select = function (index) {
			$scope.select_inventories.push($scope.inventories[index]);
			$scope.inventories.splice(index,1);
		};
		// select the inventory
		$scope.remove = function (index) {
			$scope.select_inventories.splice(index,1);
		};

		$scope.clear = function (index) {
			$scope.inventories.splice(index,1);
		};
		
		// save the rent record.
		$scope.saveRecord = function () {

		};
	}
]);
