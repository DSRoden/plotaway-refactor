'use strict';

 var Mongo  = require('mongodb');

function Note(o){
  this.userId = o.userId;
  this.tripId = Mongo.ObjectID(o.tripId);
  this.info =  o.info;
  this.date = new Date();
}

Object.defineProperty(Note, 'collection', {
  get: function(){return global.mongodb.collection('notes');}
});

Note.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Note.collection.findOne({_id:_id}, cb);
};

Note.create = function(user, note, cb){
  var o = {};
  o.userId = user._id;
  o.tripId = note.tripId;
  o.info = note.info;
  o.date = new Date();
  var newNote = new Note(o);
  Note.collection.save(newNote, cb);
};

Note.all = function(user, tripId, cb){
  console.log('trip id before mongoid>>>>>>>>', tripId);
  var id = Mongo.ObjectID(tripId);
  console.log('trip id after mongoid>>>>>>>>>', id);
    Note.collection.find({tripId: id}).toArray(cb);
};

module.exports = Note;

