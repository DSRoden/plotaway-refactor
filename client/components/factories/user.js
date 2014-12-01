(function(){
  'use strict';

  angular.module('plotaway')
  .factory('User', ['$http', function($http){

    function register(user){
      return $http.post('/register', user);
    }

    function login(user){
      return $http.post('/login', user);
    }

    function logout(){
      return $http.delete('/logout');
    }

     function user(){
      return $http.get('/user');
    }

    return {register:register, login:login, logout:logout, user:user};
  }]);
})();

