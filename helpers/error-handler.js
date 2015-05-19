var Error = require('../models/error'),
    messages = require('../config/messages.json'),
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
        
        if ("responseJson" in options) {
            logMessage += "\nResponse JSON was: "
            + credentialRemover.removeCredential(options['responseJson']);
        }
        
        logMessage += "\n\n";
        
        return logMessage;
    }
};


ErrorHandler.prototype.newError = function(onCompleteCallback, response, errorMessage, options) {
    var error = new Error();

    var _this = this;

    var completeData = '';
    response.on('data', function(chunk) {
        completeData += chunk;
    });
    
    response.on('end', function () {
        // error data should be returned by neeedo API
        var innerErrorMessage = errorMessage;
        try {
            var errorData = JSON.parse(completeData);
            // passthrough neeedo API error messages if given and only if an entry in message.json exist
            if ('error' in errorData && errorData['error'] in messages) {
                // use own error message, adapt from neeedo API response {error: "errorMessage"}
                innerErrorMessage = messages[errorData['error']];
            }
        } catch (e) {
           // data cannot be parsed
        }

        var innerOptions = options;
        innerOptions['responseJson'] = completeData;

        error.addLogMessage(_this.buildLogMessage(innerOptions, response))
            .addErrorMessage(innerErrorMessage);

        onCompleteCallback(error);
    });
};

ErrorHandler.prototype.newMessageError = function(onCompleteCallback, errorMessage) {
    var error = new Error();

    error.addErrorMessage(errorMessage);

    onCompleteCallback(error);
};

ErrorHandler.prototype.newMessageAndLogError = function(onCompleteCallback, errorMessage, logMessage) {
    var error = new Error();

    error.addErrorMessage(errorMessage)
        .addLogMessage(logMessage);

    onCompleteCallback(error);
};

var errorHandler = new ErrorHandler();

module.exports = errorHandler;