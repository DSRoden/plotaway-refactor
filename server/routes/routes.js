'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    debug          = require('../lib/debug'),
    security       = require('../lib/security'),
    home           = require('../controllers/home'),
    pages          = require('../controllers/pages'),
    trips          = require('../controllers/trips'),
    plots         = require('../controllers/plots'),
    sherpas          = require('../controllers/sherpas'),
    comments          = require('../controllers/comments'),
    notes          = require('../controllers/notes'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../../public'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));
  app.get('/publicitineraries', trips.getPublic);
  //app.get('/user', users.user);
  app.post('/itinerarypages', trips.getItineraryPages);
  app.post('/itineraryplots', plots.getItineraryPlots);

  app.use(security.authenticate);
  app.use(debug.info);

  app.get('/home', home.index);
  app.post('/register', users.register);
  app.post('/login', users.login);
  app.delete('/logout', users.logout);

  app.use(security.bounce);
  app.post('/pages', pages.all);
  app.post('/setpage', pages.set);

  app.post('/newtrip', trips.create);
  app.get('/trips', trips.index);
  app.post('/settrip', trips.set);
  app.get('/lasttrip', trips.last);
  app.delete('/removetrip/:id', trips.remove);
  app.post('/privacysettings', trips.privacy);

  app.post('/newpage', pages.create);
  app.delete('/removepage/:id', pages.remove);

  app.post('/plots', plots.create);
  app.get('/plots', plots.all);
  //app.get('/tripplots', plots.allPlots);
  app.delete('/removeplot/:id', plots.remove);

  app.post('/notes',  notes.create);
  app.post('/notes/:id',  notes.all);

  app.post('/comment',  comments.create);
  app.post('/comments',  comments.all);
  app.post('/destination', sherpas.findDestination);

  console.log('Express: Routes Loaded');
};

