// Register `phoneList` component, along with its associated controller and template
angular
  .module('phoneList')
  .component('phoneList', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
    templateUrl: 'phone-list/phone-list.template.html',
    controller: ['$http', '$scope', 'uiGridGridMenuService',
      function PhoneListController($http, $scope, uiGridGridMenuService) {
        $scope.phones = [];
        $scope.menuItems = [];

        $scope.gridOptions = {
          data: [],
          enableGridMenu: true,
          enableFiltering: true,
          onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
          }
        }

        $http.get('/phones/phones.json').then(function (response) {
          $scope.phones = response.data;
          $scope.gridOptions.data = $scope.phones;
        });

        $scope.clear = function () {
          $scope.gridApi.core.clearAllFilters();
        };

        $scope.toggleColumns = function () {
          console.log('uiGridGridMenuService.getMenuItems($scope.gridApi) :>> ', uiGridGridMenuService.getMenuItems($scope.gridApi));

          $scope.menuItems = uiGridGridMenuService.getMenuItems($scope.gridApi);
        }
      }]
  });
