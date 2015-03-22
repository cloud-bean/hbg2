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
