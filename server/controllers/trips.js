'use strict';

var Trip = require('../models/trip');

exports.create = function(req, res){
  Trip.create(req.user, req.body, function(err,trip){
    res.send({trip: trip});
  });
};

exports.index = function(req, res){
  Trip.all(req.user, function(err, trips){
    res.send({trips:trips});
  });
};

exports.set = function(req, res){
  console.log(req.user.email);
  console.log(req.body);
  Trip.set(req.user, req.body, function(err, trip){
    console.log(trip);
    res.send({trip:trip});
  });
};

exports.last = function(req, res){
  Trip.lastTrip(req.user, function(err, trip, pages, plots, notes){
    console.log(trip);
    console.log('last/ pages>>>>>>>>>>>>', pages);
    console.log('last/ notes>>>>>>>>>>>>>>', notes);
    res.send({trip:trip, pages:pages, plots: plots, notes: notes});
  });
};

exports.remove = function(req, res){
  Trip.remove(req.params.id, function(err, trip){
    res.send({err:err});
  });
};

exports.privacy = function(req, res){
  Trip.privacySetting(req.user, req.body, function(err, trip){
    res.send({err:err});
  });
};

exports.getPublic = function(req, res){
  Trip.getAllPublic(function(err, itineraries){
    console.log('public trips >>>>>>>>>>>>>>', itineraries);
    res.send({itineraries:itineraries});
  });
};

exports.getItineraryPages = function(req, res){
  Trip.getItinPages(req.body, function(itinerary, pages){
    console.log(pages);
    console.log(itinerary);
    res.send({itinerary:itinerary, pages:pages});
  });
};



