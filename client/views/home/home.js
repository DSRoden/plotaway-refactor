(function(){
  'use strict';

  angular.module('plotaway')
  .controller('HomeCtrl', ['$scope', '$location', 'Home', 'User', function($scope, $location, Home, User){

    $scope.animateIntro = true;
    $scope.showLogin = true;
    $scope.showRegister = false;
    $scope.enableLogin = function(){
      $scope.showLogin =true;
      $scope.showRegister = false;
    };
    $scope.enableRegister = function(){
      $scope.showLogin =false;
      $scope.showRegister = true;
    };

    $scope.radioModel = 'Left';

    $scope.user = {};

    function success(response){
      toastr.success('You can log in now!');
      $location.path('/');
    }

    function failure(response){
      toastr.error('Error during user registration, try again.');
      $scope.user = {};
    }

    $scope.register = function(){
      User.register($scope.user).then(success, failure);
    };

    function registerSuccess(response){
      toastr.success('Hey there!');
      $location.path('/trips');
    }

    function registerFailure(response){
      toastr.error('Error during login, try again.');
      $scope.user = {};
    }

    $scope.login = function(){
      User.login($scope.user).then(registerSuccess, registerFailure);
    };
  }]);
})();

