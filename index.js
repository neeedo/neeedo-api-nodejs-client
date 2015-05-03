var options = require('./client/options'), 
    demand = require('./models/demand'),
    offer = require('./models/offer'),
    location = require('./models/location'),
    user = require('./models/user'),
    register = require('./models/register'),
    registerService = require('./services/register');

module.exports.initClient = function(neeedoApiUrl)
{
    options.setApiUrl(neeedoApiUrl);
}

/**
 * Constructor functions that are exported.
 */
module.exports.models = {
    "demand" : demand,
    "offer": offer,
    "location" : location,
    "user": user,
    "register" : register
};

module.exports.services = {
    "register": registerService
};

console.log("Neeedo API NodeJs client lifted...");