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
    Image = require('./models/image'),
    ImageList = require('./models/image-list'),
    DemandQuery = require('./models/demand-query'),
    OfferQuery = require('./models/offer-query'),
    DemandPrice = require('./models/demand/price'),
    Message = require('./models/message'),
    MessageList = require('./models/message-list'),
    Favorite = require('./models/favorite'),
    Conversation = require('./models/conversation'),
    ConversationList = require('./models/conversation-list'),
    ConversationQuery = require('./models/conversation-query'),
    LoginService = require('./services/login'),
    RegisterService = require('./services/register'),
    OfferService = require('./services/offer'),
    OfferListService = require('./services/offer-list'),
    DemandListService = require('./services/demand-list'),
    MatchingService = require('./services/matching'),
    DemandService = require('./services/demand'),
    ImageService = require('./services/image'),
    MessageService = require('./services/message'),
    MessageListService = require('./services/message-list'),
    FavoriteService = require('./services/favorite'),
    FavoriteListService = require('./services/favorite-list'),
    ConversationListService = require('./services/conversation-list')
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
};

/**
 * Constructor functions that are exported.
 */
module.exports.models = {
    "Demand" : Demand,
    "DemandList" : DemandList,
    "DemandPrice" : DemandPrice,
    "DemandQuery" : DemandQuery,
    "Offer": Offer,
    "OfferList": OfferList,
    "OfferQuery": OfferQuery,
    "Location" : Location,
    "User": User,
    "Register" : Register,
    "Login": Login,
    "Error": Error,
    "Image": Image,
    "ImageList": ImageList,
    "Favorite": Favorite,
    "Message": Message,
    "MessageList": MessageList,
    "ConversationList": ConversationList,
    "ConversationQuery": ConversationQuery,
    "Conversation": Conversation
};

module.exports.services = {
    "Register": RegisterService,
    "Login": LoginService,
    "Demand": DemandService,
    "DemandList": DemandListService,
    "Offer": OfferService,
    "OfferList": OfferListService,
    "Matching": MatchingService,
    "Image": ImageService,
    "Message": MessageService,
    "MessageList": MessageListService,
    "Favorite": FavoriteService,
    "FavoriteList": FavoriteListService,
    "ConversationList": ConversationListService
};

module.exports.options = options;
