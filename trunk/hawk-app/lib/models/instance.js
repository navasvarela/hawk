var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Instance = new Schema({
  id :ObjectId,
  name :String, 
  state :String,
  vmcontainer :String,
  logtimestamp :String,
  stateChanged: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Instance', Instance);
