'use strict';

(function() {
	// Records Controller Spec
	describe('Records Controller Tests', function() {
		// Initialize global variables
		var RecordsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Records controller.
			RecordsController = $controller('RecordsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Record object fetched from XHR', inject(function(Records) {
			// Create sample Record using the Records service
			var sampleRecord = new Records({
				name: 'New Record'
			});

			// Create a sample Records array that includes the new Record
			var sampleRecords = [sampleRecord];

			// Set GET response
			$httpBackend.expectGET('records').respond(sampleRecords);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.records).toEqualData(sampleRecords);
		}));

		it('$scope.findOne() should create an array with one Record object fetched from XHR using a recordId URL parameter', inject(function(Records) {
			// Define a sample Record object
			var sampleRecord = new Records({
				name: 'New Record'
			});

			// Set the URL parameter
			$stateParams.recordId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/records\/([0-9a-fA-F]{24})$/).respond(sampleRecord);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.record).toEqualData(sampleRecord);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Records) {
			// Create a sample Record object
			var sampleRecordPostData = new Records({
				name: 'New Record'
			});

			// Create a sample Record response
			var sampleRecordResponse = new Records({
				_id: '525cf20451979dea2c000001',
				name: 'New Record'
			});

			// Fixture mock form input values
			scope.name = 'New Record';

			// Set POST response
			$httpBackend.expectPOST('records', sampleRecordPostData).respond(sampleRecordResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Record was created
			expect($location.path()).toBe('/records/' + sampleRecordResponse._id);
		}));

		it('$scope.update() should update a valid Record', inject(function(Records) {
			// Define a sample Record put data
			var sampleRecordPutData = new Records({
				_id: '525cf20451979dea2c000001',
				name: 'New Record'
			});

			// Mock Record in scope
			scope.record = sampleRecordPutData;

			// Set PUT response
			$httpBackend.expectPUT(/records\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/records/' + sampleRecordPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid recordId and remove the Record from the scope', inject(function(Records) {
			// Create new Record object
			var sampleRecord = new Records({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Records array and include the Record
			scope.records = [sampleRecord];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/records\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRecord);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.records.length).toBe(0);
		}));
	});
}());