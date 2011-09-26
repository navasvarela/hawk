var express = require('express'),
    mongoose = require('mongoose'),
    InstanceModel = require('./lib/models/instance'),
    LogErrorModel = require('./lib/models/logerror'),
    SetupModel = require('./lib/models/property'),
    faye = require('faye');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(
    express.logger(),
    express.errorHandler({ dumpExceptions: true, showStack: true })); 
    
    console.log("clear the database");
    InstanceModel.remove({}, function(){});
    LogErrorModel.remove({}, function() {});
    SetupModel.remove({}, function() {});
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

// Heartbeats
app.post('/heartbeats', function(req, res) {
    var hbtime = req.body.heartbeat;
    console.log("Received heartbeat: " + hbtime);
    
    bayeux.getClient().publish('/heartbeats', {
        text: hbtime 
    });
    
    res.send('OK');
});

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.attach(app);

var InstanceController = require('./lib/controllers/instancecontroller')(app);
var ErrorController = require('./lib/controllers/errorcontroller')(app);
require('./lib/controllers/propertycontroller')(app);

InstanceController.bind("create update", function(message) {
    bayeux.getClient().publish('/instances', {
        text: message
    });
});

ErrorController.bind("create", function(message) {
     bayeux.getClient().publish('/errors', {
        text: message
    });
});

mongoose.connect('mongodb://localhost/hawk-dev');

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);