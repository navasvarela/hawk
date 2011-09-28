var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Property = new Schema({
  id :ObjectId,
  name :String, 
  value :String
});

module.exports = mongoose.model('Property', Property);
