(function(){
  'use strict';

  angular.module('plotaway')
  .factory('Itin', ['$http', function($http){

    function getPubItins(){
      console.log('inside factory for public');
      return $http.get('/publicitineraries');
    }

    function getItinPages(itineraryId){
      console.log(itineraryId);
      return $http.post('/itinerarypages', {itineraryId:itineraryId});
    }

    function getPlots(pageId){
      console.log(pageId);
      return $http.post('/itineraryplots', {pageId:pageId});
    }

    return {getPubItins: getPubItins, getItinPages:getItinPages, getPlots:getPlots};
  }]);
})();

