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
module.exports.models.demand = demand;
module.exports.models.offer = offer;
module.exports.models.location = location;
module.exports.models.user = user;
module.exports.models.register = register;
module.exports.services.register = registerService;


