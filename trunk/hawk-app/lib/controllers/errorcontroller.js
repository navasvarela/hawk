var util = require('util'),
    Spine = require('spine'),
    Error = require('../models/error');
    
var ErrorController = Spine.Class.create({
    init: function(app) {
        app.get('/errors', this.getErrors);
        app.post('/errors', this.postError);
    },
    getErrors: function(request, response) {
        console.log("Hawk: getErrors");
        Error.find({}, function(err, errors) {
            response.json(errors);
        });
    },
    postError: function(request, response) {
        console.log("Hawk: postError " + util.inspect(request.body));
        
        var error = ErrorController.saveError(request.body);
        console.log("Saved error");
        ErrorController.trigger("create", error);
        response.send('OK');
    }
});

ErrorController.extend({
    saveError: function(inputError) {
        var error = new Error();
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