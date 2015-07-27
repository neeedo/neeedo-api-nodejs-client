/*
 * Class: Error
 *
 * Instances of error are handed to onErrorCallback event methods, e.g. when neeedo API returned some error code.
 */
var _ = require('underscore');

function Error()
{
    this.response = undefined;
    this.errorMessages = [];
    this.validationMessages = [];
    this.originalParams = [];
    this.logMessages = [];
}

Error.prototype.setResponse = function(response)
{
    if (response === null || typeof response !== 'object') {
        throw new Error("Type of response must be object.");
    }

    this.response = response;
    return this;
};

Error.prototype.getResponse = function()
{
    return this.response;
};

Error.prototype.addErrorMessage = function(message)
{
    if (!_.isString(message) ) {
        throw new Error("Type of message must be string, but is " + typeof (message));
    }

    this.errorMessages.push(message);
    return this;
};

Error.prototype.getErrorMessages = function()
{
    return this.errorMessages;
};

Error.prototype.setValidationMessages = function(validationMessages)
{
    if (!_.isArray(validationMessages) ) {
        throw new Error("Type of validationMessages must be array");
    }

    this.validationMessages = validationMessages;
    return this;
};

Error.prototype.hasValidationMessages = function()
{
    for (var key in this.validationMessages) {
        // at least one iteration on this associative array / object, so we have validation messages
        return true;        
    }
    
    return false;
};

Error.prototype.getValidationMessages = function()
{
    return this.validationMessages;
};

Error.prototype.setOriginalParameters = function(originalParams)
{
    if (!_.isObject(originalParams) ) {
        sails.log.info('exce');
        throw new Error("Type of originalParams must be array");
    }

    for (var i=0; i < originalParams.length; i++) {
        if (originalParams[i] == undefined) {
            originalParams[i] = "";
        }
    }
    
    this.originalParams = originalParams;
    return this;
};

Error.prototype.getOriginalParameters = function()
{
    return this.originalParams;
};

Error.prototype.addLogMessage = function(message)
{
    if ("string" !== typeof(message) ) {
        throw new Error("Type of message must be string.");
    }

    this.logMessages.push(message);
    return this;
};

Error.prototype.getLogMessages = function()
{
    return this.logMessages;
};

module.exports = Error;