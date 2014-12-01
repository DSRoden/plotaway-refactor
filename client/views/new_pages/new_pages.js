(function(){
  'use strict';

  angular.module('plotaway')
  .controller('NewPagesCtrl', ['$scope', 'Page', '$modalInstance', '$route','$rootScope', '$timeout','newPage',
    function($scope, Page, $modalInstance, $route, $rootScope, $timeout, newPage){

      $scope.newPage = newPage;
      $scope.form = {
        title: $scope.newPage.title
      };

      $scope.dismiss = function(){
        $modalInstance.dismiss();
      };

      // create a new page then refresh site and send confirmation toast --
      // the current trip's id get attached to the page on node's side

      $scope.submit = function(){
        Page.create($scope.form).then(function(response){
          $scope.page = response.data.page;
          $modalInstance.close($scope.page);
          toastr.success('Added a page! Open it and plot away!');
        });
      };
    }
  ]);
})();

