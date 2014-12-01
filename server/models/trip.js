'use strict';

 var Mongo  = require('mongodb');

function Trip(o){
  this.title = o.title;
  this.userId = o.userId;
  this.isSet = (o.isSet) ? true : false;
  this.description = o.description;
  this.start =  (o.dates.start) ? new Date(o.dates.start) : 'No Start Date';
  this.end = (o.dates.end) ? new Date(o.dates.end) : 'No End Date';
  this.budget = (o.budget === null) ? 0 : parseInt(o.budget);
  this.region = o.region;
  this.isPublic = false;
  this.comments = 0;
}

Object.defineProperty(Trip, 'collection', {
  get: function(){return global.mongodb.collection('trips');}
});

Trip.findById = function(o, cb){
  var _id = Mongo.ObjectID(o.tripId);
  Trip.collection.findOne({_id:_id}, cb);
};

Trip.create = function(user, o, cb){
  o.userId = user._id;
  var trip = new Trip(o);
  Trip.collection.save(trip, function(err, trip){
    //var p = {title: 'First Page', isSet: true, tripId: trip._id};
    //require('./page').create(user, p, function(err, page){
      cb(err, trip);
    //});
  });
};

Trip.all = function(user, cb){
  Trip.collection.find({userId:user._id}).toArray(cb);
};

Trip.set = function(user, o, cb){
  var _id = Mongo.ObjectID(o.tripId);
  Trip.collection.update({userId: user._id}, {$set: {isSet: false}}, {multi: true}, function(err, trips){
    Trip.collection.update({_id:_id}, {$set: {isSet: true}}, function(err, trip){
      require('./page').collection.update({userId: user._id}, {$set: {isSet: false}}, {multi:true}, function(err, pages){
        Trip.collection.findOne({userId: user._id, isSet: true}, function(err, setTrip){
        console.log(trip);
        cb(null, setTrip);
        });
      });
    });
  });
};

Trip.lastTrip = function(user, cb){
  console.log('inside last trip>>>>>>>>>>>', user);
  Trip.collection.findOne({userId: user._id, isSet: true}, function(err, trip){
    if(trip){
    require('./page').collection.find({tripId: trip._id}).toArray(function(err, pages){
      console.log('getting last trip>>>>>>>>>>>>>', trip);
      require('./plot').collection.find({tripId: trip._id}).toArray(function(err, plots){
        console.log('trip Id for getting notes>>>>>>>', trip._id);
        require('./note').collection.find({tripId: trip._id}).toArray(function(err, notes){
          console.log('notes>>>>>>>>>>>', notes);
          cb(err, trip, pages, plots, notes);
        });
      });
    });
   } else {
    cb();
   }
  });
};

Trip.remove = function(id, cb){
  var _id = Mongo.ObjectID(id);
  require('./page').collection.remove({tripId: _id}, function(err, something){
    require('./plot').collection.remove({tripId: _id}, function(err, something2){
      Trip.collection.remove({_id: _id}, cb);
    });
  });
};

Trip.privacySetting = function(user, setting, cb){
  var value = (setting.setting === 'public') ? true : false,
      id = Mongo.ObjectID(setting.tripId);
      console.log('this is the value coming out of chainging the public settings>>>>>>>>>', value);
  Trip.collection.update({_id: id}, {$set: {isPublic: value}}, cb);
};

Trip.getAllPublic = function(cb){
  Trip.collection.find({isPublic: true}).toArray(cb);
};

Trip.getItinPages = function(o, cb){
  var id = Mongo.ObjectID(o.itineraryId);
  Trip.collection.findOne({_id : id}, function(err, itinerary){
    require('./page').collection.find({tripId: id}).toArray(function(err, pages){
      cb(itinerary, pages);
    });
  });
};

module.exports = Trip;

