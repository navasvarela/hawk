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
        Instance.find({}, function(err, instances) {
            response.json(instances);
        });
    },
    getInstance: function(request, response) {
        var instancename = request.params.instancename;
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
        Instance.count({ name: instanceName }, function(err, count) {
            response.send("{'total': "+ count + "}");
        });
    },
    postInstance: function(request, response) {
        var instanceName = request.body.name;
        Instance.count({ name: instanceName }, function(err, count) {
            if (count === 0) {
                var instance = InstanceController.saveInstance(request.body);
                InstanceController.trigger("create", instance);
                response.send('OK');
            } else {
                console.log("Cannot create an existing instance:" + instanceName);
                response.send(409);
            }
        });
        
    },
    putInstance: function(request, response) {
        var instanceName = request.params.instancename;
        
        Instance.count({ name: instanceName }, function(err, count) {
            var instance = InstanceController.saveInstance(request.body);
            InstanceController.trigger("update", instance);
            response.send('OK');
        });
        
    }
});

InstanceController.extend({
    saveInstance: function(inputInstance) {
        var instance = new Instance();
        instance.name = inputInstance.name;
        instance.state = inputInstance.state;
        instance.context = inputInstance.context;
        instance.vmcontainer = inputInstance.vmcontainer;
        instance.logtimestamp = inputInstance.logtimestamp;
        instance.save(function(err) {
            if (err) {
                return new Error("unable to save instance: " + instance.name + "- " + err);
            }
            
            
        });
        
        return instance;
    }
});

InstanceController.extend(Spine.Events);
module.exports = function(app) {
    new InstanceController(app);  
    return InstanceController;
};