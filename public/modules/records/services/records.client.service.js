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