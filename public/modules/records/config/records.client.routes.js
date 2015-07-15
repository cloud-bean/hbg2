'use strict';

//Setting up route
angular.module('records').config(['$stateProvider',
	function($stateProvider) {
		// Records state routing
		$stateProvider.
		state('createRecord', {
			url: '/records/create',
			templateUrl: 'modules/records/views/create-record.client.view.html'
		})
		.state('listRecord', {
			url: '/records/list',
			templateUrl: 'modules/records/views/list-record.client.view.html'
		})
		.state('returnBook', {
					url: '/records/return',
					templateUrl: 'modules/records/views/return-record.client.view.html'
    });

	}
]);
