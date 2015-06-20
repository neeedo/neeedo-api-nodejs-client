var http = require('../client/http'),
    OfferListModel = require('../models/offer-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    _ = require('underscore'),
    OptionBuilder = require('../helpers/option-builder');

/**
 * Matching service: match a user's demands by recieving offers from neeedo API.
 * @constructor
 */
function Matching() 
{
    this.apiEndpoint = '/matching';

    this.buildQueryString = function(demandQueryModel) {
        return demandQueryModel.buildQueryString();
    }
}

/**
 * Match the given demand. Neeedo API will return matching offers that are given to the onSuccessCallback.
 *
 * @param demandModel see models/demand.js
 * @param demandQueryModel see models/demand-query.js
 * @param onSuccessCallback will be called with a models/demand-list.js instance and the input models/demand.js model
 * @param onErrorCallback will be called with a models/error.js model
 */
Matching.prototype.matchDemand = function(demandModel, demandQueryModel, onSuccessCallback, onErrorCallback)
{
    if (demandModel === null || typeof demandModel !== 'object') {
        throw new Error("Type of demandModel must be object.");
    }

    if (!_.isObject(demandQueryModel)) {
        throw new Error("Type of demandQueryModel must be object.");
    }

    var matchDemandUrl = this.apiEndpoint + '/demand' + this.buildQueryString(demandQueryModel);
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

                            var matchedOffers = new OfferListModel().loadFromSerialized(offerData['offers']);
                            onSuccessCallback(matchedOffers, demandModel);
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
            new OptionBuilder().addAuthorizationToken(demandModel.getUser()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.matching_demands_internal_error, e.message);
    }
};


module.exports = Matching;