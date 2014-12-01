(function(){
  'use strict';

  angular.module('plotaway', ['ngRoute', 'angular-loading-bar','LocalForageModule', 'ui.bootstrap', 'ngAnimate', 'flow','typeWriterModule', 'angularFileUpload', 'autocompletePlace', 'google-maps', 'wikiSherpaModule', 'anguFixedHeaderTable'])
  .config(['$routeProvider', '$httpProvider', '$sceDelegateProvider', '$localForageProvider', function($routeProvider, $httpProvider, $sceDelegateProvider, $localForageProvider){
     $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://en.wikivoyage.org/**']);
     $routeProvider
    .when('/', {templateUrl:'/views/home/home.html', controller:'HomeCtrl'})
    //.when('/register', {templateUrl:'/views/register/register.html', controller:'RegisterCtrl'})
    //.when('/login',    {templateUrl:'/views/login/login.html',       controller:'LoginCtrl'})
    .when('/logout',   {templateUrl:'/views/logout/logout.html',     controller:'LogoutCtrl'})
    .when('/trips',   {templateUrl:'/views/trips/trips.html',     controller:'TripsCtrl'})
    .when('/itineraries',   {templateUrl:'/views/publicItins/itins.html',     controller:'PublicItinCtrl'})
    .when('/itinerary/:id',   {templateUrl:'/views/publicItins/individual-itin.html',     controller:'ItineraryCtrl'})
    .otherwise({redirectTo:'/'});

    $httpProvider.interceptors.push('HttpInterceptor');
    $localForageProvider.config({name:'plotaway', storeName:'cache', version:1.0});
  }]);
})();

