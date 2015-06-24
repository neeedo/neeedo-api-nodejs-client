/*
 * dependencies
 */
var Demand = require('./demand'),
    _ = require('underscore');

/*
 * Class: ConversationQuery
 *
 * This class is a simple object to keep conversation-list query parameters.
 *
 * It encapsulates parameter names that will be sent to the neeedo API endpoints.
 */
function ConversationQuery()
{
    this.readParameterName = 'read';
    
    this.read = undefined;
}

ConversationQuery.prototype.checkForMandatoryParameters = function()
{
    if (!this.hasReadFlag()) {
        throw new Error('Mandatory field read is missing.');
    }
}

ConversationQuery.prototype.buildQueryString = function()
{
    this.checkForMandatoryParameters();
    
    var parameters = [];

    parameters.push(this.readParameterName + '=' + this.getReadFlag());

    return "?" + parameters.join("&");
};

ConversationQuery.prototype.setReadFlag = function(readFlag)
{
    if (_.isBoolean(readFlag)) {
        this.readFlag = readFlag;
    }

    return this;
};

ConversationQuery.prototype.hasReadFlag = function()
{
    return undefined !== this.readFlag;
};

ConversationQuery.prototype.getReadFlag = function()
{
    return this.readFlag;
};

module.exports = ConversationQuery;
