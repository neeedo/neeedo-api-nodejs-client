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

Error.prototype.addValidationMessage = function(validationMessages)
{
    if (!_.isArray(validationMessages) ) {
        throw new Error("Type of validationMessages must be string, but is " + typeof (message));
    }

    this.validationMessages = validationMessages;
    return this;
};

Error.prototype.getValidationMessages = function()
{
    return this.validationMessages;
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