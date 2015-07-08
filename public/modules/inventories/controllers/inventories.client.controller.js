(function() {
    'use strict';

    // Inventories controller
    angular.module('inventories')
        .controller('InventoriesController', InventoriesController);


    InventoriesController.$injector = ['$scope', '$http', '$timeout', '$stateParams', '$location', 'Authentication', 'Inventories'];

    function InventoriesController($scope, $http, $timeout, $stateParams, $location, Authentication, Inventories) {
        
        $scope.authentication = Authentication;
        $scope.newTags = [];
        $scope.canSubmit = true;

        var timeout;
        var WAIT_MILL_SECONDS = 350;

        // define all the functions.
        var _create, _remove, _update, _find, _save_quick_edit, _delete, _initPaging, _findOne, _addTag, _addNewTag, _watchListener;

        angular.extend($scope, {
            create: _create, // Create new Inventory
            remove: _remove, // Remove existing Inventory
            update: _update,
            find: _find,
            save_quick_edit: _save_quick_edit,
            delete: _delete,
            initPaging: _initPaging,
            findOne: _findOne,
            addTag: _addTag,
            addNewTag: _addNewTag,
            DoCtrlPagingAct: _DoCtrlPagingAct
        });

        $scope.$watch('keyword', _watchListener);


        // >>>>>>>>>> details for the functions starts >>>>>>>>>>>>>>

        // Create new Inventory
        function _create() {
            // Create new Inventory object
            $scope.canSubmit = false;
            var inventory = new Inventories({
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
                pub_date: this.pub_date,

            });

            // Redirect after save
            inventory.$save(function(response) {
                $location.path('inventories/' + response._id);
                $scope.canSubmit = true;

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.canSubmit = true;
            });
        };

        function _remove() {
            if (inventory) {
                inventory.$remove();

                for (var i in $scope.inventories) {
                    if ($scope.inventories[i] === inventory) {
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
        function _update() {
            var inventory = $scope.inventory;

            inventory.$update(function() {
                $location.path('inventories/' + inventory._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Inventories
        function _find() {
            $scope.inventories = Inventories.query();
        };

        // save the quick edit of inventroy
        function _save_quick_edit(index) {
            var _inventory = new Inventories($scope.inventories[index]);
            console.log('_inventory:', _inventory);
            _inventory.$update(function() {
                alert('修改结果已经保存！\r\n图书：' + _inventory.name + '\r\n编号：' + _inventory.inv_code);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        function _delete(index) {
            var _inventory = new Inventories($scope.inventories[index]);
            if (_inventory) {
                _inventory.$remove();
                $scope.inventories.splice(index, 1);

                $timeout(function() {
                    alert('删除完成！\r\n图书：' + _inventory.name + '\r\n编号：' + _inventory.inv_code);
                }, WAIT_MILL_SECONDS);
            }
        };

        function _initPaging() {
            $http({
                method: 'GET',
                url: '/inventories/total'
            }).success(function(data, err) {
                $scope.totalSize = data.size;
            });

            $scope.currentPage = 1;
            $scope.pageSize = 25;

            $http({
                method: 'GET',
                url: '/inventories/page/' + $scope.currentPage + '/' + $scope.pageSize
            }).success(function(data, err) {
                $scope.inventories = data;
            });

            //$scope.$apply();
        };

        // Find existing Inventory
        function _findOne() {
            $scope.inventory = Inventories.get({
                inventoryId: $stateParams.inventoryId
            });
        };

        // add tag the current inventory
        function _addTag() {
            $scope.inventory.tags.push({
                'name': this.newTag
            });
            this.newTag = '';
        };

        // add new tag when create the inventory
        function _addNewTag() {
            $scope.newTags.push({
                'name': this.newTag
            });
            this.newTag = '';
        };

        function _DoCtrlPagingAct(text, page, pageSize, total) {
            $scope.inventories = [];
            $http({
                method: 'GET',
                url: '/inventories/page/' + $scope.currentPage + '/' + $scope.pageSize
            }).success(function(data, err) {
                $scope.inventories = data;
            });
        };

        function _watchListener(newKeyword) {
            $scope.searching = true;
            if (newKeyword) {
                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(function() {
                    $http({
                            method: 'GET',
                            url: '/inventories/name/' + newKeyword
                        })
                        .success(function(data, err) {
                            $scope.inventories = data;
                            $scope.searching = false;
                            $http({
                                method: 'GET',
                                url: '/inventories/isbn/' + newKeyword
                            }).success(function(books, err) {
                                for (var i = 0; i < books.length; i++) {
                                    $scope.inventories.push(books[i]);
                                }
                                $scope.totalSize = $scope.inventories.length;
                            });
                        });
                }, WAIT_MILL_SECONDS);
            }
        };

    }

})();
