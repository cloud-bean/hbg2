'use strict';

//Setting up route
angular.module('records').config(['$stateProvider',
	function($stateProvider) {
		// Records state routing
		$stateProvider.
		state('listRecords', {
			url: '/records',
			templateUrl: 'modules/records/views/list-records.client.view.html'
		}).
		state('createRecord', {
			url: '/records/create',
			templateUrl: 'modules/records/views/create-record.client.view.html'
		}).
		state('viewRecord', {
			url: '/records/:recordId',
			templateUrl: 'modules/records/views/view-record.client.view.html'
		}).
		state('editRecord', {
			url: '/records/:recordId/edit',
			templateUrl: 'modules/records/views/edit-record.client.view.html'
		});
	}
]);