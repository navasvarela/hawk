var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Instance = new Schema({
  id :ObjectId,
  entityId :String, 
  state :String,
  stateChanged: Date
});

var TestInstance = mongoose.model('Instance', Instance);

// setup test data
var i1 = new TestInstance();
i1.name="i-a1";
i1.state = "pending";
i1.save();

var i2 = new TestInstance();
i2.name = "i-a2";
i2.state = "running";
i2.save();

module.exports = mongoose.model('Instance');
