/*jshint -W030 */
/*jshint camelcase: false*/
/*global google, pdfMake*/
(function(){
  'use strict';

  angular.module('plotaway')
  .controller('TripsCtrl', ['$scope', '$sce', 'Trip', 'Page', 'Plot', 'Note', 'Wiki', 'Itin', '$modal', '$location', '$rootScope', '$interval', '$route', '$routeParams', '$log',
    function($scope, $sce, Trip, Page, Plot, Note, Wiki, Itin, $modal, $location, $rootScope, $interval, $route, $routeParams, $log){

    $scope.trip        = {};
    $scope.trips       = [];
    $scope.tools       = ['Wiki', 'Map', 'Budget', 'Tips'];
    $scope.pages       = [];
    $scope.page        = {};
    //$scope.plots        = [];
    $scope.destination = {};
    $scope.showMap     = false;
    $scope.showAccordian = false;
    $scope.showWiki    = false;
    $scope.showPage    = false;
    $scope.showTripSet    = false;
    $scope.sherpa      = {};
    $scope.allTripPlots   = [];
    $scope.note = {};
    $scope.notes = [];
    $scope.itineraries = false;
    $scope.mainController = false;
    $scope.showEverything = false;
    $scope.showMain = false;
    $scope.sideBar = false;
    $scope.showPagesBar = false;
    $scope.showPlot = false;
    $scope.goExplore = false;
    $scope.showBrowse = false;
    $scope.privacy = {};


    //explore
    $scope.explore = function(){
        $location.path('/itineraries');
    };

    //public private radio
    $scope.makePrivate = function(){
      $scope.privacy.setting = 'private';
      $scope.changePrivacy();
    };

    $scope.makePublic = function(){
      $scope.privacy.setting = 'public';
      $scope.changePrivacy();
    };

    $scope.changePrivacy = function(){
      $scope.privacy.tripId = $scope.trip._id;
      Trip.privacy($scope.privacy).then(function(response){
        console.log(response);
        $scope.getPublicItineraries();
      });
    };

    $scope.shows = function(){
      $scope.showMain = true;
      $scope.sideBar = true;
    };



    //scrolling side bar
    //$(function(){

    //var $sidebar   = $('#main-menu'),
        //$window    = $(window),
        //offset     = $sidebar.offset(),
        //topPadding = 15;

    //$window.scroll(function(){
        //if ($window.scrollTop() > offset.top){
            //$sidebar.stop().animate({
                //marginTop: $window.scrollTop() - offset.top + topPadding
            //});
        //} else {
            //$sidebar.stop().animate({
                //marginTop: 0
            //});
        //}
    //});

   // });


    //showing pages if they are available
    if($scope.pages > 0){
      $scope.pageAvailable = true;
      }


    //dashboard//
    $scope.seeTrips = function(){
      $scope.mainDashboard = false;
      $scope.itineraries = true;
      $scope.mainController = true;
    };

    $scope.explore - function(){
      $scope.mainController = true;
      $scope.showEverything = true;
      $scope.showBrowse = true;
    };

//////////////////////////////////////////////////////////////////////////////////////////
///////MAP, SHOULD BE REFACTORED TO ANOTHER CONTROLLER, ALSO NOT FLUID ENOUGH//////////
//////////////////////////////////////////////////////////////////////////////////////

    //set scope properties for map
    $scope.gPlace;
    $scope.city    = {};
    $scope.cityCap = null;
    $scope.lat     = 36.16;
    $scope.lng     = -86.78;

    //make a function that will create a map with a marker
    var updateMap = function(lat, lng){
      $scope.map = {
        center: {
          latitude: $scope.lat,
          longitude: $scope.lng
        },
        zoom: 12
      };

      //code place marker/pin
      $scope.marker= {
        id:0,
        coords: {
          latitude: $scope.lat,
          longitude: $scope.lng
        },
        options: {draggable: true},
        refresh: true,
        events: {
          dragend: function(marker, eventName, args){
                    $log.log('marker dragend');
                    $log.log(marker.getPosition().lat());
                    $log.log(marker.getPosition().lng());
                    $log.log(marker.setAnimation(google.maps.Animation.BOUNCE));
                  }
        }
     };
  };

     $scope.showWeather = true,
    //call the function to make the map
    updateMap();

    //geocode function
    function codeAddress(){
      var address = $scope.city.name,
          geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': address}, function(results, status){
        //var name = results[0].geometry.formatted_address,
        $scope.lat= results[0].geometry.location.lat(),
        $scope.lng = results[0].geometry.location.lng();
        //console.log($scope.lat, $scope.lng);
      });
    }

    // find location info and update map
    $scope.mapLocation = function(){
       $scope.cityCap= $scope.city.name.split(',')[0];
       //var city = $scope.city.name;
       //console.log(city);
       //geocode the city
       codeAddress();
       updateMap();
       //refresh the map
       $scope.map.refresh;
    };

    //close map
    $scope.closeMap = function(){
      $scope.showMap = false;
    };

    $scope.activateMap = function(){
      $scope.showMap = true;
    };
///////////////////////////////////////////////////////////////////
/////////END OF MAP CODE/////////////////////////////////////////
////////////////////////////////////////////////////////////////

    $scope.activateWiki = function(){
      $scope.showWiki = true;
    };


    //set destination for wiki, start with cities
    $scope.setDestination = function(){
      $scope.showAccordian = false;
      $scope.sherpa = {};
      $scope.destination.point = $scope.destination.point.split(',')[0];
      Wiki.travel($scope.destination.point).then(function(response){
        $scope.sherpa = response.data.destination;
        $scope.sherpa.link = response.data.destination.url;
        console.log($scope.sherpa.link);
        $scope.sherpa.url = $sce.trustAsResourceUrl($scope.sherpa.link);
        console.log($scope.sherpa.url);
        $scope.showAccordian = true;
      });
    };


    //toggle map from wiki
    $scope.mapDestination = function(){
       $scope.city.name = $scope.destination.point;
       codeAddress();
       updateMap();
       //refresh the map
       $scope.map.refresh;
       $scope.showMap = true;
    };

    $scope.closeWiki = function(){
      $scope.showWiki = false;
      $scope.showAccordian = false;
    };

   //dynamic headers for wiki topics

   $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    //show tools as they are selected
    $scope.fetchTool = function(tool){
      switch(tool){
        case 'Map':
          $scope.showMap = true;
          break;
        case 'Wiki':
          $scope.showWiki = true;
      }
    };

//////////////////////////////////////////////////
///////////////////////PLOTS/////////////////////
////////////////////////////////////////////////

   $scope.newPlot = function(){
   if(!$scope.page.title){return;}
    var newPlotModal = $modal.open({
      templateUrl: '/views/new_plots/new_plots.html',
      controller: 'NewPlotsCtrl',
      resolve: {
        newPlot: function(){
          return $scope.newPlot;
        }
      }
     });

    newPlotModal.result.then(function(plot){
      //$scope.lastPlotAdded = plot;
      //$scope.plots.push($scope.lastPlotAdded);
      //$route.reload('/trips');
        Plot.all().then(function(response){
          $scope.plots = response.data.plots;
          $scope.getRecent();
       });
    });
  };

    //enable sorting
    $scope.sort ='-cost';
    $scope.showDescription = false;
    $scope.describe = {};
    $scope.description = function(plot){
      console.log(plot);
      $scope.describe.describe = plot;
      $scope.showDescription = true;
      var t = $scope.describe.describe;
      console.log(t);
      //var docDefinition = {content: t};
      //pdfMake.createPdf(docDefinition).download('optionalName.pdf');
    };

    // enable delete
    $scope.deletePlot = function(plot){
      var index = $scope.plots.indexOf(plot);
      console.log(index);
      $scope.sum -= plot.cost;
      for(var i = 0; i < $scope.allTripPlots.length; i++){
        if($scope.allTripPlots[i]._id === plot._id){
          var index2 = $scope.allTripPlots[i];
          $scope.allTripPlots.splice(index2,1);
        }
      }
      Plot.remove(plot).then(function(response){
        $scope.plots.splice(index,1);
      });
    };

///////////////////////////////////////
//////////////PDF/////////////////////
/////////////////////////////////////

$scope.array = [['Date', 'Time', 'Category', 'Description', 'Cost', 'Priority']];

$scope.convertPlots = function(){
  for(var i = 0; i < $scope.plots.length; i++){
    var array = [],
        description = $scope.plots[i].description,
        time = $scope.plots[i].time,
        date = $scope.plots[i].date,
        priority = $scope.plots[i].priority,
        category = $scope.plots[i].category,
        cost = '$' + String($scope.plots[i].cost);
    array.push(date, time, category, description, cost, priority);
    console.log(array);
    $scope.array.push(array);
    array = [];
  }
};


$scope.makePdf = function(){
  $scope.plotEstimate = $scope.plots.map(function(plot){
    return plot.cost;
  });
  $scope.plotSum = $scope.plotEstimate.reduce(function(pv, cv){return pv + cv;}, 0);

  $scope.convertPlots();
  var array = $scope.array,
     docDefinition = {
    content: [
        {text: 'PLOTAWAY Itinerary', style: 'header'},
        'Enjoy your trip and safe travels!',
        'Your cost estimate for this itinerary is: $' + $scope.plotSum ,
        {text: '', style: 'subheader'},
        {
            style: 'tableExample',
            table: {
                widths: [70, 70, 90, 90, 60, 60],
                body: array
            }
        }
      ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  },
  name = $scope.page.title;
  pdfMake.createPdf(docDefinition).download(name +'.pdf');
  $scope.array = [];
};

  $scope.tripPdf = function(){
    $scope.plots = $scope.allTripPlots;
    var tempTitle = $scope.page.title;
    $scope.page.title = $scope.trip.title;
    $scope.makePdf();
    $scope.page.title = tempTitle;
    Plot.all().then(function(response){
      $scope.plots = response.data.plots;
      //$scope.showTripSet = false;
    });
  };


/////////////////////////////////////////////////////////
///////BEGINNING OF TRIPS AND PAGES/////////////////////
///////////////////////////////////////////////////////

     //show trip settings
    $scope.tripSettings = function(){
      //$scope.showTable = false;
      $scope.tripSetOpen = true;
    };

     //close trip info
    $scope.closeTripSet = function(){
      $scope.tripSetOpen = false;
    };

    //close page
    $scope.closePage = function(){
      $scope.showPage = false;
    };

    //initiate a modal form for creating a new page
    $scope.newPage = function(){
     var newPageModal = $modal.open({
        templateUrl: '/views/new_pages/new_pages.html',
        controller: 'NewPagesCtrl',
        resolve: {
          newPage : function(){
            return $scope.newPage;
          }
        }
      });


     // set the results of the modal form
     // to lastTripAdded and push it into trips array
     newPageModal.result.then(function(page){
       $scope.sum += page.cost;
       $scope.lastPageAdded = page;
       $scope.pages.push($scope.lastPageAdded);
     });
    };

    // set and display page to the one user selects from Pages
    $scope.setPage = function(page){
      $scope.showPage = false;
      $scope.page = page;
      Page.set($scope.page._id).then(function(response){
        $scope.page = response.data.page;
        Plot.all().then(function(response){
          $scope.plots = response.data.plots;
          //$scope.showTripSet = false;
          $scope.showPage = true;
          $scope.showPlot = true;
          toastr.success('You can add plots now!');
        });
      });
    };

    //initialize page with most recent trip,
    //make sure if this is the first trip to set
    //the 'registration' trip as current trip
    //also bring back all pages associated with said trip

    if($scope.trips.length === 1){
    $scope.trip = $scope.trips[0];
    }

    $scope.estimate = [];

    $scope.getRecent = function(){
    Trip.getLast().then(function(response){
      $scope.trip = response.data.trip;
      $scope.radioModel = ($scope.trip.isPublic) ? 'Right' : 'Left';
      $scope.notes  = response.data.notes;
      $scope.allTripPlots = response.data.plots;
        Page.all($scope.trip).then(function(response){
          $scope.pages = response.data.pages;
        });
      if($scope.allTripPlots){
      $scope.estimate = $scope.allTripPlots.map(function(plot){
        return plot.cost;
      });
      }

      $scope.sum = $scope.estimate.reduce(function(pv, cv){return pv + cv;}, 0);

      for(var i = 0; i < $scope.pages.length; i++){
        if($scope.pages[i].isSet === true){
          $scope.page = $scope.pages[i];
        }
      }
    });
    };


    //get recent
    $scope.getRecent();

    //add a note
    $scope.addNote = function(){
      $scope.note.tripId = $scope.trip._id;
      Note.create($scope.note).then(function(response){
        $scope.note = response.data.note;
        $scope.notes.push($scope.note);
        $scope.note = {};
        //console.log($scope.notes);
      });
    };


    //get all notes now takes places inside get trip
     // Note.all($scope.trip).then(function(response){
      //  $scope.notes = response.data.notes;
     // });


    //set and display trip one user selects from 'My Trips'
    $scope.setTrip = function(trip){
      $scope.notes = [];
      $scope.trip = trip;
      Note.all($scope.trip).then(function(response){
        $scope.notes = response.data.notes;
        console.log($scope.notes);
      });

      Trip.set($scope.trip._id).then(function(response){
        $scope.trip = response.data.trip;
        console.log($scope.trip);
        $scope.showMap = false;
        Page.all($scope.trip).then(function(response){
          $scope.pages = response.data.pages;
          $scope.showPage = false;
          $scope.page = {};
          $scope.showTripSet = true;
          $scope.tripSetOpen = true;
          $scope.showPagesBar = true;
          $scope.showPlot = false;
        });
        //$route.reload('/trips');
      });
    };

    //get all trips from db on intial load and subsequent loads
    $scope.getAllTrips = function(){
    Trip.all().then(function(response){
      $scope.trips = response.data.trips;
      //console.log($scope.trips);
      if($scope.trips.length < 1){
        $scope.mainDashboard = true;
        $scope.showTripSet = false;
      } else {
        $scope.showEverything = true;
        $scope.showTripSet = true;
        $scope.tripSetOpen = true;
        $scope.showMain = true;
        $scope.sideBar = true;
        $scope.showPagesBar = true;
      }
    });
  };

   $scope.getAllTrips();

    //initiate a modal form for creating a new trip
    $scope.newTrip = function(){
     var newTripModal = $modal.open({
        templateUrl: '/views/new_trips/new_trips.html',
        controller: 'NewTripsCtrl',
        resolve: {
          newTrip : function(){
            return $scope.newTrip;
          }
        }
      });

     // set the results of the modal form
     // to lastTripAdded and push it into trips array
     newTripModal.result.then(function(trip){
       $scope.lastTripAdded = trip;
       $scope.trips.push($scope.lastTripAdded);
       $scope.plots = [];
       $scope.mainDashboard = false;
       $scope.sideBar = true;
       $scope.setTrip($scope.lastTripAdded);
       $route.reload('/trips');
      });
    };

    // delete page
    $scope.delPage = function(){
      $scope.page = {};
      $scope.showPlot = false;
      $scope.showPage=false;
      Page.remove($scope.page).then(function(response){
        var index = $scope.pages.indexOf($scope.page);
        $scope.pages.splice(index,1);
        if($scope.pages.length === 0){
          $scope.showPlot = false;
        }
      });
    };

    //delete trip
    $scope.delTrip = function(){
      Trip.remove($scope.trip).then(function(response){
        var index = $scope.trips.indexOf($scope.trip);
        $scope.trips.splice(index,1);
        if($scope.trips.length > 0){
        $scope.trip = $scope.trips[0];
        } else {
        $scope.trip = {};
        $scope.notTrips = true;
        $scope.showTripSet = false;
        }
      });
    };

  }]);
})();

