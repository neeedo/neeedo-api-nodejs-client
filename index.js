var options = require('./client/options'), 
    Demand = require('./models/demand'),
    Offer = require('./models/offer'),
    Location = require('./models/location'),
    User = require('./models/user'),
    Register = require('./models/register'),
    Login = require('./models/login'),
    LoginService = require('./services/login'),
    RegisterService = require('./services/register')
    ;

module.exports.initClient = function(neeedoApiUrl, allowSelfSignedHttpsCertificates, isDebug)
{
    console.info("Initializing client with apiUrl " + neeedoApiUrl + "...");

    options.setApiUrl(neeedoApiUrl);
    
    if (allowSelfSignedHttpsCertificates) {
        console.info("Allowing self signed HTTPS certificates...");
        options.setAllowSelfSignedCertificates(true);
    }   
    
    options.setDebug(isDebug);
}

/**
 * Constructor functions that are exported.
 */
module.exports.models = {
    "Demand" : Demand,
    "Offer": Offer,
    "Location" : Location,
    "User": User,
    "Register" : Register,
    "Login": Login
};

module.exports.services = {
    "Register": RegisterService,
    "Login": LoginService
};

module.exports.options = options;

console.log("Neeedo API NodeJs client lifted...");