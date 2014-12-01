(function(){
  'use strict';

  angular.module('plotaway')
  .factory('Plot', ['$http', function($http){

    function create(plot){
      console.log(plot);
      return $http.post('/plots', plot);
    }

    function all(){
      return $http.get('/plots');
    }

    function getAllPlots(){
      return $http.get('/tripplots');
    }

    function remove(plot){
      console.log(plot);
      return $http.delete('/removeplot/' + plot._id);
    }

    return {create:create, all:all, getAllPlots:getAllPlots, remove:remove};
  }]);
})();

