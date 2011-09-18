var express = require('express'),
    mongoose = require('mongoose'),
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
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

require('./lib/routes/instances')(app);

// start faye server
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.listen(8000);
console.log("Started faye server on port 8000");

mongoose.connect('mongodb://localhost/hawk-dev');

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

setInterval(function() {
    console.log("New email..Sending event to all subscriber");
    bayeux.getClient().publish('/faye', {
        text: 'New email has arrived!' 
    });
}, 1000);
