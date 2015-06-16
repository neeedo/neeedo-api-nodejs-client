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

    if (offset !== parseInt(offset)) {
        throw new Error("Type of offset must be int.");
    }

    if (limit !== parseInt(limit)) {
        throw new Error("Type of limit must be int.");
    }

    var matchDemandUrl = this.apiEndpoint + this.buildDemandMatchingQueryString(offset, limit);
    var json = JSON.stringify(demandModel.serializeForMatching());

    try {
        http.doPost(matchDemandUrl, json,
            function(response) {
                   var completeData = '';
       
                    response.on('data', function(chunk) {
                        completeData += chunk;
                    });

                    response.on('end', function () {
                        // success on 200 OK
                        if (200 == response.statusCode) {
                            // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                            var offerData = JSON.parse(completeData);

                            globalOptions.getLogger().info("Services/Matching::matchDemand(): server sent response data " + completeData);

                            var matchedOffers = new OfferListModel().loadFromSerialized(offerData);
                            onSuccessCallback(matchedOffers);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.matching_demands_internal_error,
                                { "methodPath" : "Services/Matching::matchDemand()" });
                        }
                    });

                    response.on('error', function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.no_api_connection,
                            { "methodPath" : "Services/Matching::matchDemand()" });
                    });
            },
            onErrorCallback,
            {
                authorizationToken: demandModel.getUser().getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.matching_demands_internal_error, e.message);
    }
};


module.exports = Matching;