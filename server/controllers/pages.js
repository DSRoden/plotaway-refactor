'use strict';

var Page= require('../models/page');

exports.set = function(req, res){
  Page.set(req.user, req.body, function(err, page, plots){
    console.log('set page and returning it>>>>>', page);
    res.send({page:page, plots: plots});
  });
};

exports.create = function(req, res){
  Page.create(req.user, req.body, function(err,page){
    res.send({page: page});
  });
};

exports.remove = function(req, res){
  Page.remove(req.params.id, function(err, page){
    res.send({err:err});
  });
};


//exports.index = function(req, res){
  //Trip.all(req.user, function(err, trips){
    //res.send({trips:trips});
  //});
//};

//exports.set = function(req, res){
  //console.log(req.body);
  //Trip.set(req.user, req.body, function(err, trip){
    //console.log(trip);
    //res.send({trip:trip});
  //});
//};

//exports.last = function(req, res){
  //Trip.lastTrip(req.user, function(err, trip){
    //console.log(trip);
    //res.send({trip:trip});
  //});
//};

exports.all = function(req, res){
  Page.allByTripId(req.body, function(err, pages){
    console.log('boards>>>>>>>>', pages);
    res.send({pages:pages});
  });
};

////exports.findBoard = function(req, res){
  ////Board.findByIdWithPages(req.body, function(err, board, pages){
    //console.log('board>>>>>', board);
    //console.log('pages>>>>>', pages);
    //res.send({board:board, pages:pages});
  //});
//};
