(function(){
  'use strict';

  angular.module('plotaway')
  .controller('NewPlotsCtrl', ['$scope', 'Plot', '$modalInstance', '$route','$rootScope', '$timeout','newPlot',
    function($scope, Plot, $modalInstance, $route, $rootScope, $timeout, newPlot){

  $scope.date = {};

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function(){
    $scope.ismeridian = ! $scope.ismeridian;
  };

      $scope.newPlot = newPlot;
      $scope.form = {
        time: $scope.date,
        category: $scope.newPlot.category,
        priority: $scope.newPlot.priority,
        cost: $scope.newPlot.cost
      };

      $scope.dismiss = function(){
        $modalInstance.dismiss();
      };

      // create a new page then refresh site and send confirmation toast --
      // the current trip's id get attached to the page on node's side

      $scope.submit = function(){
        console.log($scope.form);
        Plot.create($scope.form).then(function(response){
          $scope.page = response.data.page;
          $modalInstance.close($scope.page);
          toastr.success('Added a Plot!');
        });
      };
    }
  ]);
})();

