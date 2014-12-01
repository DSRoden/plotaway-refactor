(function(){
  'use strict';

  angular.module('plotaway')
  .factory('Trip', ['$http', function($http){

    function create(trip){
      return $http.post('/newtrip', trip);
    }

    function all(){
      return $http.get('/trips');
    }

    function set(tripId){
      return $http.post('/settrip', {tripId:tripId});
    }

    function getLast(){
      return $http.get('/lasttrip');
    }

    function remove(trip){
      return $http.delete('/removetrip/' + trip._id);
    }

    function privacy(setting){
      console.log(setting);
      return $http.post('/privacysettings', setting);
    }

    return {all:all, create: create, set: set, getLast:getLast, remove:remove, privacy:privacy};
  }]);
})();

