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
