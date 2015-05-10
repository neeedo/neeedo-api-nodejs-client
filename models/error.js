/*
 * Class: Error
 *
 * Instances of error are handed to onErrorCallback event methods, e.g. when neeedo API returned some error code.
 */
function Error()
{
    this.response = undefined;
    this.errorMessages = [];
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
    if ("string" !== typeof(message) ) {
        throw new Error("Type of message must be string.");
    }

    this.errorMessages.push(message);
    return this;
};

Error.prototype.getErrorMessages = function()
{
    return this.errorMessages;
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