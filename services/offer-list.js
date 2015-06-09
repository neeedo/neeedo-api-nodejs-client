var http = require('../client/http'),
    OfferListModel = require('../models/offer-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    _ = require('underscore');

/*
 * Class: DemandList
 *
 * This class realizes the connectivity to Offer list services (multiple offers).
 */
function OfferList()
{
    this.apiEndpoint = '/offers';

    this.buildPaginationQueryString = function(offerQuery) {
        return offerQuery.buildQueryString();
    }
}

/**
 * Function: loadByUser
 *
 * Load given user's offers.
 *
 * @param user
 * @param offerQueryModel see models/offer-query
 * @param onSuccessCallback will be called with models/offer-list instance
 * @param onErrorCallback will be called with models/error instance
 */
OfferList.prototype.loadByUser = function(user, offerQueryModel, onSuccessCallback, onErrorCallback)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }

    if (!_.isObject(offerQueryModel)) {
        throw new Error("Type of offerQueryModel must be object.");
    }

    var getOfferByUserUrl = this.apiEndpoint + "/users/" + user.getId()  + this.buildPaginationQueryString(offerQueryModel);

    try {
        http.doGet(getOfferByUserUrl,
            function(response) {
                var completeData = '';

                response.on('data', function(chunk) {
                    completeData += chunk;
                });

                response.on('end', function () {
                    // success on 200 OK
                    if (200 == response.statusCode) {

                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                        var offersData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/OfferList::loadByUser(): server sent response data " + completeData);

                        var loadedOfferList = new OfferListModel().loadFromSerialized(offersData['offers']);

                        onSuccessCallback(loadedOfferList);
                    } else {
                        errorHandler.newError(onErrorCallback, response, messages.get_offers_error,
                            { "methodPath" : "Service/OfferList::loadByUser()" });
                    }
                });

                response.on('error', function(error) {
                    // API not reachable
                    errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                        {"methodPath": "Services/OfferList::loadByUser()"});
                });
            }, onErrorCallback,
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_offers_internal_error, e.message);
    }
};

/**
 * Function: loadMostRecent
 *
 * Load most recent offers (PUBLIC action).
 *
 * @param offerQueryModel see models/offer-query
 * @param onSuccessCallback will be called with models/offer-list instance
 * @param onErrorCallback will be called with models/error instance
 */
OfferList.prototype.loadMostRecent = function(offerQueryModel, onSuccessCallback, onErrorCallback)
{
    if (!_.isObject(offerQueryModel)) {
        throw new Error("Type of offerQueryModel must be object.");
    }

    var getMostRecentOffersUrl = this.apiEndpoint + this.buildPaginationQueryString(offerQueryModel);

    try {
        http.doGet(getMostRecentOffersUrl,
            function(response) {
                var completeData = '';
                response.on('data', function(chunk) {
                    completeData += chunk;
                });

                response.on('end', function () {
                    // success on 200 OK
                    if (200 == response.statusCode) {
                        var offersData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/OfferList::loadMostRecent(): server sent response data " + completeData);

                        var loadedOfferList = new OfferListModel().loadFromSerialized(offersData['offers']);

                        onSuccessCallback(loadedOfferList);
                    } else {
                        errorHandler.newError(onErrorCallback, response, messages.get_most_recent_offers_error,
                            { "methodPath" : "Services/OfferList::loadMostRecent()" });
                    }
                });

                response.on('error', function(error) {
                    errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                        { "methodPath" : "Services/OfferList::loadMostRecent()" });
                });
            }, onErrorCallback, {});
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_most_recent_offers_error, e.message);
    }
};

module.exports = OfferList;
