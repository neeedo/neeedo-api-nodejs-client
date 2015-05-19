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
        var errorData = JSON.parse(completeData);

        var innerErrorMessage = errorMessage;
        var innerOptions = options;
        innerOptions['responseJson'] = completeData;

        // passthrough neeedo API error messages if given
        if ('error' in errorData) {
            innerErrorMessage = errorData['error'];
        }

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