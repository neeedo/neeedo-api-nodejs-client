var Error = require('../models/error'),
    credentialRemover = require('../helpers/credential-remover');

function ErrorHandler() {
    this.buildLogMessage = function (options, response) {
        var logMessage = "";
        
        if ("methodPath" in options) {
            logMessage += options['methodPath'] + ": ";
        }
        
        logMessage += 'Neeedo API sent response ' + response.statusCode + ' ' + response.statusMessage;
        
        if ("requestJson" in options) {
            logMessage += "\nRequest JSON was: "
            + credentialRemover.removeCredential(options['requestJson']);
        }
        
        logMessage += "\n\n";
        
        return logMessage;
    }
};


ErrorHandler.prototype.newError = function(response, errorMessage, options) {
    var error = new Error();
    
    error.addLogMessage(this.buildLogMessage(options, response))
        .addErrorMessage(errorMessage);
    
    return error;
};

ErrorHandler.prototype.newMessageError = function(errorMessage) {
    var error = new Error();

    error.addErrorMessage(errorMessage);

    return error;
};

ErrorHandler.prototype.newMessageAndLogError = function(errorMessage, logMessage) {
    var error = new Error();

    error.addErrorMessage(errorMessage)
        .addLogMessage(logMessage);

    return error;
};

var errorHandler = new ErrorHandler();

module.exports = errorHandler;