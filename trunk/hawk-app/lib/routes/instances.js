
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

var get_instances = function(request, response) {
  console.log("Hawk: get_instance");
  Instance.find({}, function(err, instances) {
      response.json(instances);
  });
};

var get_instance = function(request, response) {
  var instancename = request.params.instancename;
  console.log("Hawk: get_instance(" + instancename + ")");
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

var post_instance = function(request, response) {
  console.log("Hawk: post_instance " + util.inspect(request.body));
  var instanceName = request.body.name;

  if (Instance.find({name: instanceName})) {
    console.log("Cannot create an existing instance:" + instanceName);
    response.send(409);
  } else {
    saveInstance(request.body);
    response.send('OK');
  }
};

var put_instance = function(request, response) {
  console.log("Hawk: put_instance" + util.inspect(request.body));
  saveInstance(request.body);
  response.send('OK');
};

module.exports = function(app) {
  app.get('/instances', get_instances);
  app.get('/instances/:instancename', get_instance);
  app.post('/instances', post_instance);
  app.put('/instances', put_instance);
};
