'use strict';

// Members controller
angular.module('members').controller('MembersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Members', 'Records' , 'Inventories',
	function($scope, $http, $stateParams, $location, Authentication, Members, Records, Inventories) {
		$scope.authentication = Authentication;
		$scope.records = [];
		// Create new Member
		$scope.create = function() {
			// Create new Member object
			var member = new Members({
				phone_number: this.phone_number,
				baby_name: this.baby_name,
				baby_birthday: this.baby_birthday,
				isBoy: this.isBoy,
				card_number: this.card_number,
				valid_days: this.valid_days,
				level: this.level,
				parent_name: this.parent_name,
				address: this.address,
				email: this.email,
				weixin: this.weixin,
				other: this.other
            });
			

			// Redirect after save
			member.$save(function(response) {
				$location.path('members/' + response._id);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Member
		$scope.remove = function(member) {
			if ( member ) { 
				member.$remove();

				for (var i in $scope.members) {
					if ($scope.members [i] === member) {
						$scope.members.splice(i, 1);
					}
				}
			} else {
				$scope.member.$remove(function() {
					$location.path('members');
				});
			}
		};

		// Update existing Member
		$scope.update = function() {
			var member = $scope.member;

			member.$update(function() {
				$location.path('members/' + member._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Members
		$scope.find = function() {
			$scope.members = Members.query();
		};

		// Find existing Member
		$scope.findOne = function() {
			$scope.member = Members.get({ 
				memberId: $stateParams.memberId
			});
		};

        // // TODO: Find member by name
        // $scope.findByCardNumber = function() {   
        //     $scope.member = Members.get({
        //         card_number: $stateParams.card_number
        //     });
        // };
        $scope.findHistroyRecords = function() {
        	$scope.findOne();
        	$http({
                method: 'GET',
                url: '/records/member/' + $stateParams.memberId
            })
            .success(function(data, err) {
            	$scope.records = data;
            });
        };

        // return book. update the record , update the inventory.
        $scope.returnBook = function (index) {
        	var _record = $scope.records[index];

        	Records.get({recordId: _record._id}, function (record, err) {
        		record.return_date = Date.now();
        		record.status = 'A';
        		record.$update();

        		// update the dom
        		$scope.records[index].return_date = record.return_date ;
        		$scope.records[index].status = 'A';
        	});

        	var inventory = new Inventories(_record.inventory);
            inventory.isRent = false;
            inventory.$update();

        };
 	}
]);
