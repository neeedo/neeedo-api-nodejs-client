var http = require('../client/http'),
    OfferListModel = require('../models/offer-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

/**
 * Matching service: match a user's demands by recieving offers from neeedo API.
 * @constructor
 */
function Matching() 
{
    this.apiEndpoint = '/matching';
    
    this.buildDemandMatchingQueryString = function(offset, limit) {
        return "/demand/" + offset + "/" + limit;
    } 
}

/**
 * Match the given demand. Neeedo API will return matching offers that are given to the onSuccessCallback.
 *
 * @param demandModel see models/demand.js
 * @param offset int 
 * @param limit int
 * @param onSuccessCallback will be called with a models/demand-list.js instance
 * @param onErrorCallback will be called with a models/error.js model
 */
Matching.prototype.matchDemand = function(demandModel, offset, limit, onSuccessCallback, onErrorCallback)
{
    if (demandModel === null || typeof demandModel !== 'object') {
        throw new Error("Type of demandModel must be object.");
    }

    var matchDemandUrl = this.apiEndpoint + this.buildDemandMatchingQueryString(offset, limit);
    var json = JSON.stringify(demandModel.serializeForMatching());
    
    // closure
    var _this = this;
    try {
        http.doPost(matchDemandUrl, json,
            function(response) {
                // success on 200 OK
                if (200 == response.statusCode) {
                    var completeData = '';
                    response.on('data', function(chunk) {
                        completeData += chunk;
                    });

                    response.on('end', function () {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                        var offerData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/Matching::matchDemand(): server sent response data " + completeData);

                        var matchedOffers = new OfferListModel().loadFromSerialized(offerData);
                        onSuccessCallback(matchedOffers);
                    });
                } else {
                    errorHandler.newError(onErrorCallback, response, messages.matching_demands_internal_error,
                        { "methodPath" : "Services/Matching::matchDemand()" });
                }
            },
            {
                authorizationToken: demandModel.getUser().getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.matching_demands_internal_error, e.message);
    }
};


module.exports = Matching;