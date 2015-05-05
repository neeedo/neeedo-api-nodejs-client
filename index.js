var options = require('./client/options'), 
    demand = require('./models/demand'),
    offer = require('./models/offer'),
    location = require('./models/location'),
    user = require('./models/user'),
    register = require('./models/register'),
    login = require('./models/login'),
    loginService = require('./services/login'),
    registerService = require('./services/register')
    ;

module.exports.initClient = function(neeedoApiUrl, allowSelfSignedHttpsCertificates)
{
    console.log("Initializing client with apiUrl " + neeedoApiUrl + "...");

    options.setApiUrl(neeedoApiUrl);
    
    if (allowSelfSignedHttpsCertificates) {
        console.log("Allowing self signed HTTPS certificates...");
        
        options.setAllowSelfSignedCertificates(true);
    }   
}

/**
 * Constructor functions that are exported.
 */
module.exports.models = {
    "demand" : demand,
    "offer": offer,
    "location" : location,
    "user": user,
    "register" : register,
    "login": login
};

module.exports.services = {
    "register": registerService,
    "login": loginService
};

module.exports.options = options;

console.log("Neeedo API NodeJs client lifted...");