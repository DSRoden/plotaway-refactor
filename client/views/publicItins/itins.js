(function(){
  'use strict';

  angular.module('plotaway')
  .controller('PublicItinCtrl', ['$scope', '$location', 'Plot', 'Itin', 'User','$localForage', function($scope, $location, Plot, Itin, User, $localForage){
    $scope.plots = [];
    $scope.page = {};
    $scope.showBrowse = true;
    $scope.regions = ['All', 'Asia', 'Africa', 'Antartica', 'Australia', 'Europe', 'Middle East', 'North America', 'South America'];

    $localForage.getItem('email').then(function(email){
      $scope.email = email;
      if($scope.email !== null){
        $scope.yesUser = true;
      }
    });

    $scope.backToTrips = function(){
      $location.path('/trips');
    };

    $scope.publicItineraries = [];

    //User.user().then(function(response){
         //debugger;
      //$scope.user = response.data;
      //console.log($scope.user);
    //});

    //$scope.getItins = function(){
       //Itin.getPubItins().then(function(response){
         //$scope.itineraries = response.data.itineraries;
         //console.log($scope.publicItineraries);
       //});
    //};


    $scope.displayItin = function(itinerary){
      $location.path('/itinerary/' + itinerary._id);
    };

    $scope.getByRegion = function(region){
      console.log(region);
      if(region === 'All'){
        Itin.getPubItins().then(function(response){
          $scope.publicItineraries = response.data.itineraries;
        });
      } else {
        $scope.publicItineraries = [];
        Itin.getPubItins().then(function(response){
          var array  = response.data.itineraries;
          console.log(array);
          $scope.publicItineraries = _.filter(array, function(itinerary){
            return itinerary.region === region;
            });
         });
        }
      };

    $scope.getByRegion('All');
  }]);
})();

