var util = require('util'),
    Spine = require('spine'),
    Property = require('../models/property');
    
var PropertyController = Spine.Class.create({
    init: function(app) {
        app.get('/Properties', this.getAllProperties);
        app.get('/Properties/:propertyname', this.getProperty);
        app.post('/Properties', this.postProperty);
    },
    getAllProperties: function(request, response) {
        Property.find({}, function(err, properties) {
            response.json(properties);
        });
    },
    getProperty: function(request, response) {
        var property = request.params.property;
        
        Property.find({ "name": property }, function(err, data) {
            if (err) {
                console.log("Unable to find property:" + property + " - " + err);
                response.send(500);
            }
            else {
                response.json(data);
            }
        });
    },
    postProperty: function(request, response) {
        PropertyController.saveProperty(request.body);
        response.send('OK');
    }
});

PropertyController.extend({
    saveProperty: function(inputProperties) {
        for(var key in inputProperties) {
            // delete existing property
            Property.remove({'name': key}, null);
        
            var property = new Property();
            property.name = key;
            property.value = inputProperties[key];
            
            property.save(function(err) {
                if (err) {
                    return new Error("unable to save instance: " + key + "- " + err);
                }
            });
        }
    }
});

module.exports = function(app) {
    new PropertyController(app);
};