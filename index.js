var options = require('./client/options'), 
    Demand = require('./models/demand'),
    DemandList = require('./models/demand-list'),
    Offer = require('./models/offer'),
    OfferList = require('./models/offer-list'),
    Location = require('./models/location'),
    User = require('./models/user'),
    Register = require('./models/register'),
    Login = require('./models/login'),
    Error = require('./models/error'),
    DemandPrice = require('./models/demand/price'),
    LoginService = require('./services/login'),
    RegisterService = require('./services/register'),
    OfferService = require('./services/offer'),
    OfferListService = require('./services/offer-list'),
    DemandListService = require('./services/demand-list'),
    DemandService = require('./services/demand')
    ;

module.exports.initClient = function(neeedoApiUrl, allowSelfSignedHttpsCertificates, logger)
{
    logger.info("Initializing client with apiUrl " + neeedoApiUrl + "...");

    options.setApiUrl(neeedoApiUrl);
    
    if (allowSelfSignedHttpsCertificates) {
        logger.info("Allowing self signed HTTPS certificates...");
        options.setAllowSelfSignedCertificates(true);
    }   
    
    options.setLogger(logger);
}

/**
 * Constructor functions that are exported.
 */
module.exports.models = {
    "Demand" : Demand,
    "DemandList" : DemandList,
    "DemandPrice" : DemandPrice,
    "Offer": Offer,
    "OfferList": OfferList,
    "Location" : Location,
    "User": User,
    "Register" : Register,
    "Login": Login,
    "Error": Error
};

module.exports.services = {
    "Register": RegisterService,
    "Login": LoginService,
    "Demand": DemandService,
    "DemandList": DemandListService,
    "Offer": OfferService,
    "OfferList": OfferListService
};

module.exports.options = options;
