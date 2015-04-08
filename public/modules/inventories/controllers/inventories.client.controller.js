'use strict';

// Inventories controller
angular.module('inventories').controller('InventoriesController', ['$scope', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Inventories',
	function($scope, $http, $timeout, $stateParams, $location, Authentication, Inventories) {
		$scope.authentication = Authentication;
		$scope.newTags = [];
		var timeout;
		
		// Create new Inventory
		$scope.create = function() {
			// Create new Inventory object
			var inventory = new Inventories ({
				// TODO: deal with the form data
				name: this.name,
				store_name: this.store_name,
				owner: this.owner,
				inv_code: this.inv_code,
				location: this.location,
				tags: this.newTags,
				isbn: this.isbn,
			  skuid: this.skuid,
			 	url: this.url,
			 	img: this.img,
			 	author: this.author,
				pub_by: this.pub_by,
			 	pub_date: this.pub_date
			});

			// Redirect after save
			inventory.$save(function(response) {
				$location.path('inventories/' + response._id);
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Inventory
		$scope.remove = function(inventory) {
			if ( inventory ) { 
				inventory.$remove();

				for (var i in $scope.inventories) {
					if ($scope.inventories [i] === inventory) {
						$scope.inventories.splice(i, 1);
					}
				}
			} else {
				$scope.inventory.$remove(function() {
					$location.path('inventories');
				});
			}
		};

		// Update existing Inventory
		$scope.update = function() {
			var inventory = $scope.inventory;

			inventory.$update(function() {
				$location.path('inventories/' + inventory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Inventories
		$scope.find = function() {
			$scope.inventories =  Inventories.query();
		};
        
		$scope.initPaging = function () {
				$http({
					method: 'GET',
					url: '/inventories/total'
				}).success(function (data, err) {
					$scope.totalSize = data.size;
				});

				$scope.currentPage = 1;
				$scope.pageSize = 25;

				$http({
					method: 'GET',
					url: '/inventories/page/' + $scope.currentPage + '/' + $scope.pageSize
				}).success(function (data, err) {
					$scope.inventories = data;
				});

				//$scope.$apply();
		};

		// Find existing Inventory
		$scope.findOne = function() {
			$scope.inventory = Inventories.get({ 
				inventoryId: $stateParams.inventoryId
			});
		};

		// add tag the current inventory
		$scope.addTag = function () {
			$scope.inventory.tags.push({'name':this.newTag});
			this.newTag = '';
		};

		// add new tag when create the inventory
		$scope.addNewTag = function () {
			$scope.newTags.push({'name':this.newTag});
			this.newTag = '';
		};

		$scope.$watch('keyword', function (newKeyword) {
			$scope.searching = true;
			if (newKeyword) {
				if (timeout) $timeout.cancel(timeout);
				timeout = $timeout(function () {
					$http({
						method: 'GET',
						url: '/inventories/name/' + newKeyword
					})
					.success(function (data, err) {
							$scope.inventories = data;
							$scope.searching = false;
							$http({
								method: 'GET',
								url: '/inventories/isbn/' + newKeyword
							}).success(function (book, err) {
								$scope.inventories.push(book);
								$scope.totalSize = $scope.inventories.length();
							});
					});
				},350);
 			}

		});

		//var combine_result  = function (arr1, arr2)  {
		//	var result = [];
    //
		//	if ( arr1 != 'null') {
		//		for (var i = 0 ; i < arr1.length ; i++ ) {
		//			result.push(arr1[i]);
		//		}
		//	}
    //
		//	if (arr2 != 'null') {
		//		for (var i = 0; i < arr2.length; i++) {
		//			result.push(arr2[i]);
		//		}
		//	}
		//	return result;
		//};

		$scope.fillFormAuto = function (index) {
			var book = $scope.inventories[index];
			$scope.name = book.name ;
			$scope.isbn = book.isbn;
			$scope.skuid= book.skuid;
			$scope.url= book.url;
			$scope.img= book.img;
			$scope.author= book.author;
			$scope.pub_by= book.pub_by;
			$scope.pub_date= book.pub_date;
			$scope.inventories = []; // clear .
			$scope.keyword = '';
		};

		$scope.fillEditFormAuto = function (index) {
			var book = $scope.inventories[index];
			$scope.inventory.name = book.name ;
			$scope.inventory.isbn = book.isbn;
			$scope.inventory.skuid= book.skuid;
			$scope.inventory.url= book.url;
			$scope.inventory.img= book.img;
			$scope.inventory.author= book.author;
			$scope.inventory.pub_by= book.pub_by;
			$scope.inventory.pub_date= book.pub_date;
			$scope.inventories = []; // clear .
			$scope.keyword = '';
		};

		$scope.$watch('search_isbn', function (newKeyword) {
			$scope.results = [];
			$scope.searching = true;
			if (newKeyword) {
				if (timeout) $timeout.cancel(timeout);
				timeout = $timeout(function () {
					$http({
						method: 'GET',
						url: '/inventories/isbn/' + newKeyword
					})
						.success(function (data, err) {
							$scope.results = data;
							$scope.searching = false;
						});
				},350);
			}
		});

		$scope.DoCtrlPagingAct = function (text, page, pageSize) {
			$scope.inventories=[];
			$http({
				method: 'GET',
				url: '/inventories/page/' + $scope.currentPage + '/' + $scope.pageSize
			}).success(function (data, err) {
				$scope.inventories = data;
			});
		};
	}
]);
