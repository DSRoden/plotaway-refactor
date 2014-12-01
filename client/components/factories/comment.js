
(function(){
  'use strict';

  angular.module('plotaway')
  .factory('Comment', ['$http', function($http){

    function create(comment){
      console.log(comment);
      return $http.post('/comment', comment);
    }

    function all(id){
      return $http.post('/comments', {id:id});
    }

    return {create:create, all:all};
  }]);
})();

