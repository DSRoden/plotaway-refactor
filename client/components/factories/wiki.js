(function(){
    'use strict';

      angular.module('plotaway')
    .factory('Wiki', ['$http', function($http){

          function travel(destination){
                  return $http.post('/destination', {destination: destination});
                      }

              return {travel:travel};
                }]);
})();
