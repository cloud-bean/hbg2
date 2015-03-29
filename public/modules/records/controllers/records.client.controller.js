'use strict';

// Records controller
angular.module('records').controller('RecordsController', ['$scope', '$timeout', '$http', '$stateParams', '$location', 'Authentication', 'Records', 'Inventories',
    function($scope, $timeout, $http, $stateParams, $location, Authentication, Records, Inventories) {
        $scope.authentication = Authentication;
        $scope.showResults = false;
        $scope.inventories = [];
        $scope.select_inventories = [];
        $scope.saveSuccCount = 0;
        $scope.saveErrMsg = '';
        var timeout;
        
        // Create new Record
        $scope.create = function(member, inventory) {
            // Create new Record object
            var record = new Records({
                member: member,
                inventory: inventory,
                status: 'R'
            });
            record.$save(function(response) {
            	$scope.saveSuccCount++;
            	if ($scope.saveSuccCount === $scope.totolSaveCount) {
            		$location.path('members/' + member._id);
            	}
            }, function(errorResponse) {
                $scope.saveErrMsg += errorResponse.data.message;
            });
        };

        // Remove existing Record
        $scope.remove = function(record) {
            if (record) {
                record.$remove();

                for (var i in $scope.records) {
                    if ($scope.records[i] === record) {
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
        $scope.$watch('card_number', function(newCardNumber) {
            if (newCardNumber) {
                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(function() {
                    $scope.member_invalid_msg = '';
                    $scope.member = null;
                    $http({
                            method: 'GET',
                            url: '/members/card/' + newCardNumber
                        })
                        .success(function(data, err) {
                            $scope.member = data;
                            $scope.max_book = data.max_book || 4;

                            // get the record history.
                            $http({
                                    method: 'GET',
                                    url: '/records/member/' + $scope.member._id
                                })
                                .success(function(data, err) {
                                    var on_rent = 0;
                                    for (var i = data.length - 1; i; i--) {
                                        if (data[i].status === 'R')
                                            on_rent++;
                                    }
                                    $scope.on_rent_book = on_rent;
                                    $scope.can_rent = $scope.member.max_book - on_rent > 0 ? true : false;
                                });
                            var a_d_ms = new Date($scope.member.active_time).getTime();
                            var v_d_ms = a_d_ms + $scope.member.valid_days * 24 * 3600 * 1000;
                          
                            if (Date.now() > v_d_ms) {
                                $scope.member_invalid_msg = '会员卡到期';
                            } else if ($scope.member.locked) {
                                $scope.member_invalid_msg = '该会员已经被冻结';
                            } else {
                                $scope.member_invalid_msg = '';
                            }

                        });
                }, 350);
            }
        });

        // Find inventories by isbn/name/inv_code
        $scope.$watch('keyword', function(newKeyword) {
            if (newKeyword) {
                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(function() {
                    $http({
                            method: 'GET',
                            url: '/inventories/invCode/' + newKeyword
                        })
                        .success(function(data, err) {
                            $scope.inventories.push(data);
                            $scope.keyword = '';
                        });
                }, 350);
            }
        });

        // select the inventory to the book_list
        $scope.select = function(index) {
            // check the arr, can not be the same.
            var isExist = false;
        	for (var i = $scope.select_inventories.length - 1; i >= 0; i--) {
            	if ($scope.select_inventories[i].inv_code === $scope.inventories[index].inv_code)
                	isExist = true;
        	}

            if (!isExist) {
            	$scope.select_inventories.push($scope.inventories[index]);
            }

            $scope.inventories.splice(index, 1);
        };
        // remove the inventory from the book_list
        $scope.remove = function(index) {
            $scope.select_inventories.splice(index, 1);
        };
        // remove the inventory that already rented.
        $scope.clear = function(index) {
            $scope.inventories.splice(index, 1);
        };

        // save the rent record. check and save.
        $scope.saveRecord = function() {
        	if ($scope.select_inventories.length > $scope.member.max_book - $scope.on_rent_book) {
        		$scope.err_msg = '请减少借阅的数目';
        	} else if ($scope.member_invalid_msg !== '') {
        		$scope.err_msg += '会员目前处于不可用状态';
        	} else { // ok now.
        		$scope.saveSuccCount = 0;
        		$scope.totolSaveCount = $scope.select_inventories.length;
        		for (var i = $scope.select_inventories.length - 1; i >= 0; i--) {
        			$scope.create($scope.member, $scope.select_inventories[i]);
                    // Todo: update the book's status: isRent 
                    var _inventory = new Inventories($scope.select_inventories[i]);
                    _inventory.isRent = true;
                    _inventory.$update();
        		}
        	}
        };

        // clear all the input, init the page.
        $scope.init = function () {
	        $scope.showResults = false;
	        $scope.inventories = [];
	        $scope.select_inventories = [];
	        $scope.saveSuccCount = 0;
	        $scope.saveErrMsg = '';
	        $scope.card_number = '';
	        $scope.keyword = '';
        };

    }
]);
