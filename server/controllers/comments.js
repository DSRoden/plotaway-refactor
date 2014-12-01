'use strict';

var Comment = require('../models/comment');


exports.create = function(req, res){
  console.log(req.body);
  Comment.create(req.user, req.body, function(err, comment){
    console.log('comment saved>>>>>>>>>>>', comment);
    res.send({err: err});
  });
};

exports.all = function(req,res){
  console.log(req.body.id);
  Comment.all(req.body.id, function(err, comments){
    console.log('sending out all comments>>>>>>>>>>>', comments);
    res.send({comments:comments});
  });
};

//exports.all = function(req, res){
  //console.log('req parms id for notes>>>>>>>>>>>>>>>>', req.params.id);
  //Note.all(req.user, req.params.id, function(err, notes){
    //console.log('notes from note.all >>>>>>>>>', notes);
    //res.send({notes:notes});
  //});
//};
