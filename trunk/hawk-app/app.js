var express = require('express'),
    mongoose = require('mongoose'),
    InstanceModel = require('./lib/models/instance'),
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
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

// catch errors
app.post('/errors', function(req, res) {
   console.log("New error:" + req.body);
   res.send('OK');
});

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.attach(app);

var InstanceController = require('./lib/controllers/instancecontroller')(app);

InstanceController.bind("create update", function(message) {
    console.log("new instance message:" + message);
    bayeux.getClient().publish('/faye', {
        text: message
    });
});

mongoose.connect('mongodb://localhost/hawk-dev');

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Test code
/*
setInterval(function() {
    var instance = new InstanceModel();
    instance.name = "i-000abc";
    instance.state = "dummy state change";
    instance.vmcontainer = "vm-container-0-99";
    instance.logtimestamp = "2011-09-18 15:03:09,305";
        
    InstanceController.trigger("update", instance);
}, 2000);
*/