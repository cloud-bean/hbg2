'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'hbg';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ngQuickDate'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('inventories');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('members');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('records');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('about', {
			url: '/about',
			templateUrl: 'modules/core/views/about.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('AboutController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;  // save the authen obj.

		var hasAdminRole = function () {
			Array.prototype.contains = function(obj) {
			    var i = this.length;
			    while (i--) {
			        if (this[i] === obj) {
			            return true;
			        }
			    }
			    return false;
			};
			if ($scope.authentication.user !== '') {
				return  $scope.authentication.user.roles.contains('admin');
			} else {
				return false;
			}
		};

		$scope.isAdmin = hasAdminRole();
		$scope.member_id = $scope.authentication.user.member;
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isAdmin = hasAdminRole();
		});
		
		// $scope.isCollapsed = false;
		// $scope.menu = Menus.getMenu('topbar');

		// $scope.toggleCollapsibleMenu = function() {
		// 	$scope.isCollapsed = !$scope.isCollapsed;
		// };

		// // Collapsing the menu after navigation
		// $scope.$on('$stateChangeSuccess', function() {
		// 	$scope.isCollapsed = false;
		// });
	}
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('inventories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Inventories', 'inventories', 'dropdown', '/inventories(/create)?');
		Menus.addSubMenuItem('topbar', 'inventories', 'List Inventories', 'inventories');
		Menus.addSubMenuItem('topbar', 'inventories', 'New Inventory', 'inventories/create');
	}
]);
'use strict';

//Setting up route
angular.module('inventories').config(['$stateProvider',
	function($stateProvider) {
		// Inventories state routing
		$stateProvider.
		state('listInventories', {
			url: '/inventories',
			templateUrl: 'modules/inventories/views/list-inventories.client.view.html'
		}).
		state('createInventory', {
			url: '/inventories/create',
			templateUrl: 'modules/inventories/views/create-inventory.client.view.html'
		}).
		state('viewInventory', {
			url: '/inventories/:inventoryId',
			templateUrl: 'modules/inventories/views/view-inventory.client.view.html'
		}).
		state('editInventory', {
			url: '/inventories/:inventoryId/edit',
			templateUrl: 'modules/inventories/views/edit-inventory.client.view.html'
		});
	}
]);
'use strict';

// Inventories controller
angular.module('inventories').controller('InventoriesController', ['$scope', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Inventories',
	function($scope, $http, $timeout, $stateParams, $location, Authentication, Inventories) {
		$scope.authentication = Authentication;
		var timeout;
		
		// Create new Inventory
		$scope.create = function() {
			// Create new Inventory object
			var inventory = new Inventories ({
				name: this.name
			});

			// Redirect after save
			inventory.$save(function(response) {
				$location.path('inventories/' + response._id);

				// Clear form fields
				$scope.name = '';
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
			// var books = Inventories.query();
			// for (var i = books.length - 1; i >= 0; i--) {
			// 	books[i].status = books[i].isRent ? '借出' : '可借';
			// };
			// console.log(books);
			$scope.inventories =  Inventories.query();

		};

		// Find existing Inventory
		$scope.findOne = function() {
			$scope.inventory = Inventories.get({ 
				inventoryId: $stateParams.inventoryId
			});
		};

		$scope.$watch('keyword', function (newKeyword) {
			if (newKeyword) {
				if (timeout) $timeout.cancel(timeout);
				timeout = $timeout(function () {
					$http({
						method: 'GET',
						url: '/inventories/name/' + newKeyword
					})
					.success(function (data, err) {
						$scope.inventories = data;
					});
				},350);
 			}
		});
	}
]);

'use strict';

angular.module('inventories').directive('invSearch', [
	function($document) {
		return {
			template: '<div>{{keyword}}</div>',
			restrict: 'EA',
            scope: {
                keyword: '=search.keyword'
            },
			link: function postLink(scope, element, attrs) {
				// Inventory directive logic
				// ...
                // 300s THEN send a request to update the inv.
				//element.text('this is the inventory directive');
			}
		};
	}
]);

'use strict';

//Inventories service used to communicate Inventories REST endpoints
angular.module('inventories').factory('Inventories', ['$resource',
	function($resource) {
		return $resource('inventories/:inventoryId', { inventoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('members').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Members', 'members', 'dropdown', '/members(/create)?');
		Menus.addSubMenuItem('topbar', 'members', 'List Members', 'members');
		Menus.addSubMenuItem('topbar', 'members', 'New Member', 'members/create');
	}
]);
'use strict';

//Setting up route
angular.module('members').config(['$stateProvider',
	function($stateProvider) {
		// Members state routing
		$stateProvider.
		state('listMembers', {
			url: '/members',
			templateUrl: 'modules/members/views/list-members.client.view.html'
		}).
		state('createMember', {
			url: '/members/create',
			templateUrl: 'modules/members/views/create-member.client.view.html'
		}).
		state('viewMember', {
			url: '/members/:memberId',
			templateUrl: 'modules/members/views/view-member.client.view.html'
		}).
		state('editMember', {
			url: '/members/:memberId/edit',
			templateUrl: 'modules/members/views/edit-member.client.view.html'
		});
	}
]);

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

'use strict';

//Members service used to communicate Members REST endpoints
angular.module('members').factory('Members', ['$resource',
	function($resource) {
		return $resource('members/:memberId', { memberId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('records').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Records', 'records', 'dropdown', '/records(/create)?');
		Menus.addSubMenuItem('topbar', 'records', 'List Records', 'records');
		Menus.addSubMenuItem('topbar', 'records', 'New Record', 'records/create');
	}
]);
'use strict';

//Setting up route
angular.module('records').config(['$stateProvider',
	function($stateProvider) {
		// Records state routing
		$stateProvider.
		state('createRecord', {
			url: '/records/create',
			templateUrl: 'modules/records/views/create-record.client.view.html'
		});

		// $stateProvider.
		// state('listRecords', {
		// 	url: '/records',
		// 	templateUrl: 'modules/records/views/list-records.client.view.html'
		// }).
		// state('createRecord', {
		// 	url: '/records/create',
		// 	templateUrl: 'modules/records/views/create-record.client.view.html'
		// }).
		// state('viewRecord', {
		// 	url: '/records/:recordId',
		// 	templateUrl: 'modules/records/views/view-record.client.view.html'
		// }).
		// state('editRecord', {
		// 	url: '/records/:recordId/edit',
		// 	templateUrl: 'modules/records/views/edit-record.client.view.html'
		// });
	}
]);

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

'use strict';

//Records service used to communicate Records REST endpoints
angular.module('records').factory('Records', ['$resource',
	function($resource) {
		return $resource('records/:recordId', { recordId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
                                // login required
								Authentication.user = null;

                                // TODO: $rootScope.$boardcast('auth:loginRequired')
								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
                                
                                // TODO:$rootScope.$broadcast('auth:forbidden');
                                $location.path('403');
                                // redirct to 403.html
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
        state('403', {
            url: '/403',
            templateUrl: 'modules/users/views/authentication/403.client.view.html'
        }).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Members', 'Authentication',
	function($scope, $http, $location, Users, Members, Authentication) {
		$scope.user = Authentication.user;
		
        // If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');
        
        // populate member
        $scope.getMemberCardNumber = function () {
            Members.get({memberId:$scope.user.member}, function(data, error) {
                $scope.user.member_card_number = data.card_number;
            });
        };

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				
                var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);