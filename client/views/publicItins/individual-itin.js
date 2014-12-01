/*global  pdfMake*/

(function(){
  'use strict';

  angular.module('plotaway')
  .controller('ItineraryCtrl', ['$scope', '$routeParams', 'Plot', 'Comment', 'Itin', 'User','$localForage', '$location', function($scope, $routeParams, Plot, Comment, Itin, User, $localForage, $location){
    $scope.plot = {};
    $scope.plots = [];
    $scope.pages = [];
    $scope.publicItin = {};
    $scope.page = {};
    //$scope.onePublicItin = true;
    $scope.disableFavorite = false;

    //back to dashboard
    $scope.backToTrips = function(){
      $location.path('/trips');
    };

    //pdf
    $scope.makePublicPdf = function(){
      if($scope.noUser === true){
        $scope.disablePDF = true;
      } else{
        $scope.makePdf();
      }
    };


    //show description
    $scope.description = function(plot){
      $scope.plot = plot;
      $scope.showDescription = true;
    };
    //go back
    $scope.backToItineraries = function(){
      $location.path('/itineraries');
    };

    $scope.goLogin = function(){
      $location.path('/');
    };

    $localForage.getItem('email').then(function(email){
      $scope.email = email;
      if($scope.email !== null){
        $scope.showUserAbilities = true;
        $scope.noUser = false;
      }else{
        $scope.showUserAbilities = false;
        $scope.noUser = true;
      }
    });

    var id = $routeParams.id;
    console.log(id);

    $scope.getPagePlots = function(){
      Itin.getPlots($scope.page._id).then(function(response){
        $scope.plots = response.data.plots;
      });
    };

    Itin.getItinPages(id).then(function(response){
      $scope.publicItin = response.data.itinerary;
      $scope.pages = response.data.pages;
      $scope.onePublicItin = true;
      $scope.page = $scope.pages[0];
      console.log($scope.page);
      $scope.getPagePlots();
      $scope.displayPublicPage = true;
    });

    $scope.seePage = function(page){
      $scope.page = page;
      $scope.getPagePlots();
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

   Comment.all(id).then(function(response){
    $scope.comments = response.data.comments;
   });

    $scope.comments = [];
    $scope.comment = {};
    $scope.comment.tripId = id;
    $scope.addComment = function(){
    Comment.create($scope.comment).then(function(response){
      console.log($scope.comment);
      Comment.all(id).then(function(response2){
        $scope.comments = response2.data.comments;
      });
    });
  };



  }]);
})();

