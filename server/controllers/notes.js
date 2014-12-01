'use strict';

var Note = require('../models/note');

exports.create = function(req, res){
  console.log(req.body);
  Note.create(req.user, req.body, function(err, note){
    res.send({note:note});
  });
};

exports.all = function(req, res){
  console.log('req parms id for notes>>>>>>>>>>>>>>>>', req.params.id);
  Note.all(req.user, req.params.id, function(err, notes){
    console.log('notes from note.all >>>>>>>>>', notes);
    res.send({notes:notes});
  });
};

