var http = require('../client/http'),
    OfferListModel = require('../models/offer-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

/*
 * Class: DemandList
 *
 * This class realizes the connectivity to Offer list services (multiple offers).
 */
function OfferList()
{
    this.apiEndpoint = '/offers';
}

/**
 * Function: loadByUser
 * 
 * Load given user's demands.
 *  
 * @param user
 * @param onSuccessCallback will be called with models/offer-list instance
 * @param onErrorCallback will be called with models/error instance
 */
OfferList.prototype.loadByUser = function(user, onSuccessCallback, onErrorCallback)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }

    var getOfferByUserUrl = this.apiEndpoint + "/users/" + user.getId();

    // closure
    var _this = this;
    try {
        http.doGet(getOfferByUserUrl,
            function(response) {
                // success on 200 OK
                if (200 == response.statusCode) {
                    var completeData = '';
                    response.on('data', function(chunk) {
                        completeData += chunk;
                    });

                    response.on('end', function () {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                        var offersData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/OfferList::loadByUser(): server sent response data " + completeData);

                        var loadedOfferList = new OfferListModel().loadFromSerialized(offersData['offers']);

                        onSuccessCallback(loadedOfferList);
                    });
                } else {
                    errorHandler.newError(onErrorCallback, response, messages.get_offer_error,
                        { "methodPath" : "Service/OfferList::loadByUser()" });
                }
            },
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_offer_internal_error, e.message);
    }
};

module.exports = OfferList;