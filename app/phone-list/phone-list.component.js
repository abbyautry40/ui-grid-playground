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
          enableGridMenu: false,
          onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridId = `grid_${$scope.gridApi.grid.id}`;
          }
        }

        $http.get('/phones/phones.json').then(function (response) {
          $scope.phones = response.data;
          $scope.gridOptions.data = $scope.phones;
        });

        /**
         * We need to ensure that we have gridApi and the data needed.
         * onRegisterApi is meant to register custom functions and does
         * not call local functions.
         */
        $scope.$watchGroup(['gridApi', 'phones'], function (newValues, _) {
          if (newValues[0] && newValues[1]) {
            $scope.getMenuItems();
          }
        });

        $scope.clear = function () {
          $scope.gridApi.core.clearAllFilters();
        };

        $scope.toggleColumn = function (event, menuItem) {
          menuItem.action(event);
        }

        $scope.getMenuItems = function () {
          let menuItems = uiGridGridMenuService.getMenuItems($scope.gridApi);

          menuItems.pop(); // The last item is undefined. This is a bug in the gridApi
          menuItems.shift(); // We want to remove 'Clear All Filters' which is default behavior in the gridApi
          menuItems.shift(); // We want to remove 'Columns'

          $scope.menuItems = menuItems;
        }
      }]
  });
