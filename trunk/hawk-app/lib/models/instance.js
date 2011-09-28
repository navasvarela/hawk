var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Instance = new Schema({
  id :ObjectId,
  name :String, 
  state :String,
<<<<<<< HEAD
  stateChanged: { type: Date, 'default': Date.now }
=======
  context :String,
  vmcontainer :String,
  logtimestamp :String,
  stateChanged: { type: Date, default: Date.now }
>>>>>>> hawk/master
});

module.exports = mongoose.model('Instance', Instance);
