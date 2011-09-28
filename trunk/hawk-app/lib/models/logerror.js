var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LogError = new Schema({
  id :ObjectId,
  name :String, 
  errorLine :String,
  vmcontainer :String,
  logtimestamp :String
});

module.exports = mongoose.model('LogError', LogError);
