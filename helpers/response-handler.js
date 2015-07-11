var globalOptions = require('../client/options');

/**
 * Simplify handling of HTTP responses.
 * Constructor
 */
function ResponseHandler() {

};

ResponseHandler.prototype.handle = function(response, successCallback, errorCallback) {
    // build data string by incoming chunks
    var completeData = '';

    response.on('data', function (chunk) {
        completeData += chunk;
    });

    response.on('end', function () {
        globalOptions.getLogger().info("Server sent response data " + completeData);
        // data is complete, so let's call the callback method
        successCallback(completeData);
    });

    response.on('error', function(error) {
        errorCallback(error);
    });
};

module.exports = ResponseHandler;
