// Register `phoneList` component, along with its associated controller and template
angular
  .module('phoneList')
  .component('phoneList', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
    templateUrl: 'phone-list/phone-list.template.html',
    controller: ['$http', '$scope', 'uiGridGridMenuService',
      function PhoneListController($http, $scope, uiGridGridMenuService) {
        $scope.phones = [];
        $scope.menuItems = [];
        $scope.canViewMenu = false;

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

        $scope.clear = function () {
          $scope.gridApi.core.clearAllFilters();
        };

        $scope.toggleMenu = function () {
          /** 
           * There are issues tring to initialize getMenuItems
           * Could be a possible race condition between fetching the
           * data and registering the api.
           * 
          */
          if ($scope.menuItems && $scope.menuItems.length === 0) {
            $scope.getMenuItems();
          }

          $scope.canViewMenu = !$scope.canViewMenu;
        }

        $scope.getMenuItems = function () {
          let menuItems = uiGridGridMenuService.getMenuItems($scope.gridApi);
          menuItems.pop(); // The last item is undefined. This is a bug in the gridApi
          menuItems.shift(); // We want to remove 'Clear All Filters' which is default behavior in the gridApi
          menuItems.shift(); // We want to remove 'Columns'

          $scope.menuItems = menuItems;

          console.log('$scope.menuItems :>> ', $scope.menuItems);
        }
      }]
  });
