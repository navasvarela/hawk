
var Instance = require('../models/instance');

var get_instances = function(request, response) {
  console.log('get_instance');

  Instance.find({}, function(err, instances) {
      response.json(instances);
  });
};

var new_instance = function(request, response) {
  console.log('new_instance');
  
  var inputInstance = request.body;

  console.dir(inputInstance);

  response.send('OK');
};

module.exports = function(app) {
  app.get('/instances', get_instances);
  app.post('/instances', new_instance);
};
