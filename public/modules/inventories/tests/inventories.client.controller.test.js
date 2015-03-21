'use strict';

(function() {
	// Inventories Controller Spec
	describe('Inventories Controller Tests', function() {
		// Initialize global variables
		var InventoriesController,
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

			// Initialize the Inventories controller.
			InventoriesController = $controller('InventoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Inventory object fetched from XHR', inject(function(Inventories) {
			// Create sample Inventory using the Inventories service
			var sampleInventory = new Inventories({
				name: 'New Inventory'
			});

			// Create a sample Inventories array that includes the new Inventory
			var sampleInventories = [sampleInventory];

			// Set GET response
			$httpBackend.expectGET('inventories').respond(sampleInventories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.inventories).toEqualData(sampleInventories);
		}));

		it('$scope.findOne() should create an array with one Inventory object fetched from XHR using a inventoryId URL parameter', inject(function(Inventories) {
			// Define a sample Inventory object
			var sampleInventory = new Inventories({
				name: 'New Inventory'
			});

			// Set the URL parameter
			$stateParams.inventoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/inventories\/([0-9a-fA-F]{24})$/).respond(sampleInventory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.inventory).toEqualData(sampleInventory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Inventories) {
			// Create a sample Inventory object
			var sampleInventoryPostData = new Inventories({
				name: 'New Inventory'
			});

			// Create a sample Inventory response
			var sampleInventoryResponse = new Inventories({
				_id: '525cf20451979dea2c000001',
				name: 'New Inventory'
			});

			// Fixture mock form input values
			scope.name = 'New Inventory';

			// Set POST response
			$httpBackend.expectPOST('inventories', sampleInventoryPostData).respond(sampleInventoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Inventory was created
			expect($location.path()).toBe('/inventories/' + sampleInventoryResponse._id);
		}));

		it('$scope.update() should update a valid Inventory', inject(function(Inventories) {
			// Define a sample Inventory put data
			var sampleInventoryPutData = new Inventories({
				_id: '525cf20451979dea2c000001',
				name: 'New Inventory'
			});

			// Mock Inventory in scope
			scope.inventory = sampleInventoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/inventories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/inventories/' + sampleInventoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid inventoryId and remove the Inventory from the scope', inject(function(Inventories) {
			// Create new Inventory object
			var sampleInventory = new Inventories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Inventories array and include the Inventory
			scope.inventories = [sampleInventory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/inventories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInventory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.inventories.length).toBe(0);
		}));
	});
}());