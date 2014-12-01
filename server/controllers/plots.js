'use strict';

var Plot = require('../models/plot');

exports.create = function(req, res){
  Plot.create(req.user, req.body, function(err, plots){
    res.send({plots:plots});
  });
};

exports.all = function(req, res){
  Plot.all(req.user, function(err, plots){
    if(!plots){
    res.status(200);
    res.end();
    } else{
    console.log(plots);
    res.send({plots:plots});
    }
  });
};

//exports.allPlots = function(req, res){
  //Plot.allPerTrip(req.user, function(err, plots){
    //console.log('all pltos of current trip>>>>>', plots);
    //res.send({plots:plots});
  //});
//};

exports.remove = function(req, res){
  Plot.remove(req.params.id, function(err, plot){
    res.send({err:err});
  });
};

exports.getItineraryPlots = function(req, res){
  Plot.getItinPlots(req.body, function(err, plots){
    console.log(plots);
    res.send({plots:plots});
  });
};
