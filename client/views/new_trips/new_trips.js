(function(){
  'use strict';

  angular.module('plotaway')
  .controller('NewTripsCtrl', ['$scope', 'Trip', '$modalInstance', '$route','$rootScope', '$timeout','newTrip',
    function($scope, Trip, $modalInstance, $route, $rootScope, $timeout, newTrip){
      $scope.newTrip = newTrip;
      $scope.date = {};
      $scope.form = {
        title: $scope.newTrip.title,
        description: $scope.newTrip.description,
        dates: $scope.date,
        budget: $scope.newTrip.budget,
        region: $scope.newTrip.region
      };

      $scope.dismiss = function(){
        $modalInstance.dismiss();
      };

      // create a new trip then refresh page and send confirmation toast
      $scope.submit = function(){
        console.log($scope.form);
        Trip.create($scope.form).then(function(response){
          $scope.trip = response.data.trip;
          $modalInstance.close($scope.trip);
          toastr.success('Yay travel! New trip created.');
        });
      };
    }
  ]);
})();

