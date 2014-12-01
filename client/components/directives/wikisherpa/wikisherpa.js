(function(){
  'use strict';

  angular.module('wikiSherpaModule', [])
  .factory('SherpaApi', ['$http', function($http){
    function travel(destination){
        console.log('inside sherpa factory>>>>>', destination);
        return $http.post('/destination', {destination:destination});
    }

  return {trave:travel};
 }])
  .directive('wikiSherpa', [function(){
    var o = {};

    o.restrict    = 'A';
    o.templateUrl = '/components/directives/wikisherpa/wikisherpa.html';
    o.scope       = {destination: '@'};
    o.link        = function(scope, element, attrs){
                    };

    o.controller = ['$scope', 'SherpaApi', function($scope, SherpaApi){
                      SherpaApi.travel($scope.destination).then(function(response){
                        debugger;
                        $scope.sherpa = response.data.destination;
                      });
                  }];
    return o;
  }]);
})();

