'use strict';

angular.module('hbg')
.directive('searchMember', function () {
    return {
        restrict: 'A',
        scope: {
            cn: '@',
        },
        transclude: true,
        replace: true,
        templateUrl: 'modules/records/views/return-record.client.directive.template.html',
        controller: ['$scope', '$http', 'Records', 'Inventories', function ($scope, $http, Records, Inventories) {
            
            $scope.getMember = function (card_number) {
                $http({
                    method: 'GET',
                    url: '/members/card/' + card_number
                })
                .success(function (data, err) {
                    $scope.member = data;
                    $scope.showMember = true; 
                    $scope.getMemberRecordHistory(data._id);
                });
            };
            $scope.getMemberRecordHistory = function (_id) {
                $http({
                    method: 'GET',
                    url: '/records/member/' + _id
                })
                .success(function (data, err) {
                    
                    for (var i = data.length - 1; i >= 0; i--) {
                        if(data[i].status === 'R')
                            $scope.records.push(data[i]);
                    }
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
                    $scope.records.splice(index,1);
                });

                var inventory = new Inventories(_record.inventory);
                inventory.isRent = false;
                inventory.$update();

            };

            $scope.reinit = function () {
                $scope.showMember = false;
                $scope.member = {};
                $scope.records = [];
            };
        }],
        link: function (scope, ele, attr) {
            scope.$watch('cn', function (newVal) {
                if (newVal) {
                    scope.reinit();
                    scope.getMember(scope.cn);
                }
            });
        }
    };
});

