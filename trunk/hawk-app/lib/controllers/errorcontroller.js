var util = require('util'),
    Spine = require('spine'),
    LogError = require('../models/logerror');
    
var ErrorController = Spine.Class.create({
    init: function(app) {
        app.get('/errors', this.getErrors);
        app.post('/errors', this.postError);
    },
    getErrors: function(request, response) {
        console.log("Hawk: getErrors");
        LogError.find({}, function(err, errors) {
            response.json(errors);
        });
    },
    postError: function(request, response) {
        var error = ErrorController.saveError(request.body);
        ErrorController.trigger("create", error);
        response.send('OK');
    }
});

ErrorController.extend({
    saveError: function(inputError) {
        var error = new LogError();
        error.vmcontainer = inputError.vmcontainer;
        error.logtimestamp = inputError.logtimestamp;
        error.errorLine = inputError.errorLine;
        
        error.save(function(err) {
            if (err) {
                return new Error("unable to save error: " + error.name + "- " + err);
            } 
        });
        
        return error;
    }
});

ErrorController.extend(Spine.Events);
module.exports = function(app) {
    new ErrorController(app);  
    return ErrorController;
};