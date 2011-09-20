var util = require('util'),
    Spine = require('spine'),
    Instance = require('../models/instance');
    
var InstanceController = Spine.Class.create({
    init: function(app) {
        app.get('/instances', this.getInstances);
        app.get('/instances/:instancename/count', this.countInstances);
        app.get('/instances/:instancename', this.getInstance);
        app.post('/instances', this.postInstance);
        app.put('/instances/:instancename', this.putInstance);
    },
    getInstances: function(request, response) {
        console.log("Hawk: getInstances");
        Instance.find({}, function(err, instances) {
            response.json(instances);
        });
    },
    getInstance: function(request, response) {
        var instancename = request.params.instancename;
        console.log("Hawk: getInstance(" + instancename + ")");
        Instance.find({ "name": instancename }, function(err, instances) {
            if (err) {
                console.log("Unable to find instance:" + instancename + " - " + err);
                response.send(500);
            }
            else {
                console.dir(instances);
                response.json(instances);
            }
        });
    },
    countInstances: function(request, response) {
        var instanceName = request.params.instancename;
        console.log("Counting all instances of " + instanceName);
        Instance.count({ name: instanceName }, function(err, count) {
            console.log("Total instances:" + count);
            response.send('OK');
        });
    },
    postInstance: function(request, response) {
        console.log("Hawk: postInstance " + util.inspect(request.body));
        var instanceName = request.body.name;
        Instance.count({ name: instanceName }, function(err, count) {
            console.log("Instance " + instanceName + " count:" + count);
            if (count === 0) {
                InstanceController.trigger("create", instanceName);
                InstanceController.saveInstance(request.body);
                response.send('OK');
            } else {
                console.log("Cannot create an existing instance:" + instanceName);
                response.send(409);
            }
        });
        
    },
    putInstance: function(request, response) {
        console.log("Hawk: putInstance" + util.inspect(request.body));
        var instanceName = request.params.instancename;
        
        Instance.count({ name: instanceName }, function(err, count) {
            console.log("Instance " + instanceName + " count:" + count);
            InstanceController.trigger("update", instanceName);
            InstanceController.saveInstance(request.body);
            response.send('OK');
        });
        
    }
});

InstanceController.extend({
    saveInstance: function(inputInstance) {
        var instance = new Instance();
        instance.name = inputInstance.name;
        instance.state = inputInstance.state;
        instance.vmcontainer = inputInstance.vmcontainer;
        instance.logtimestamp = inputInstance.logtimestamp;
        instance.save(function(err) {
            if (err) {
                return new Error("unable to save instance: " + instance.name + "- " + err);
            }
        });
    }
});

InstanceController.extend(Spine.Events);
module.exports = function(app) {
    new InstanceController(app);  
    return InstanceController;
};