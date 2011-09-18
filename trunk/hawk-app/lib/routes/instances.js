
var util = require('util'),
    Instance = require('../models/instance');

var saveInstance = function(inputInstance) {
  var instance = new Instance();
  instance.name = inputInstance.name;
  instance.state = inputInstance.state;

  instance.save(function(err) {
      if (err) {
          return new Error("unable to save instance: " + instance.name + " - " + err);
      } 
  });
};

var getInstances = function(request, response) {
  console.log("Hawk: getInstance");
  Instance.find({}, function(err, instances) {
      response.json(instances);
  });
};

var getInstance = function(request, response) {
  var instancename = request.params.instancename;
  console.log("Hawk: getInstance(" + instancename + ")");
  Instance.find({"name": instancename}, function(err, instances) {
    if (err) {
      console.log("Unable to find instance:" + instancename + " - " + err);
      response.send(500);
    } else {
      console.dir(instances);
      response.json(instances);
    }
  });
};

var postInstance = function(request, response) {
  console.log("Hawk: postInstance " + util.inspect(request.body));
  var instanceName = request.body.name;

  if (Instance.find({name: instanceName})) {
    console.log("Cannot create an existing instance:" + instanceName);
    response.send(409);
  } else {
    saveInstance(request.body);
    response.send('OK');
  }
};

var putInstance = function(request, response) {
  var self = this;
  console.log("Hawk: putInstance" + util.inspect(request.body));
  saveInstance(request.body);
  response.send('OK');
};

module.exports = function(app) {
  app.get('/instances', getInstances);
  app.get('/instances/:instancename', getInstance);
  app.post('/instances', postInstance);
  app.put('/instances', putInstance);
};