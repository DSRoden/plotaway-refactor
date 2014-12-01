(function(){
  'use strict';

  angular.module('plotaway')
  .factory('Page', ['$http', function($http){

    function create(page){
      return $http.post('/newpage', page);
    }

    function all(trip){
      return $http.post('/pages', trip);
    }

    function set(page){
      return $http.post('/setpage', {page:page});
    }

    function remove(page){
      return $http.delete('/removepage/' + page._id);
    }

    return {create:create, all:all, set:set, remove:remove};
  }]);
})();

