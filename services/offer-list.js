var http = require('../client/http'),
    OfferListModel = require('../models/offer-list'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    _ = require('underscore'),
    OptionBuilder = require('../helpers/option-builder');

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
                    var responseHandler = new ResponseHandler();

                    responseHandler.handle(
                        response,
                        function(completeData) {
                            // success on 200 OK
                            if (200 == response.statusCode) {

                                // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                                var offersData = JSON.parse(completeData);
                                var loadedOfferList = new OfferListModel().loadFromSerialized(offersData['offers']);

                                onSuccessCallback(loadedOfferList);
                            } else {
                                errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_offers_error,
                                    { "methodPath" : "Service/OfferList::loadByUser()" });
                            }
                        },
                        function(error) {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_offers_error,
                                { "methodPath" : "Service/OfferList::loadByUser()" });
                        }
                    )
            }, onErrorCallback,
            new OptionBuilder().addAuthorizationToken(user).getOptions());
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
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        // success on 200 OK
                        if (200 == response.statusCode) {
                            var offersData = JSON.parse(completeData);

                            var loadedOfferList = new OfferListModel().loadFromSerialized(offersData['offers']);

                            onSuccessCallback(loadedOfferList);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_most_recent_offers_error,
                                { "methodPath" : "Services/OfferList::loadMostRecent()" });
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                            { "methodPath" : "Services/OfferList::loadMostRecent()" });
                    }
                )
            }, onErrorCallback, {});
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_most_recent_offers_error, e.message);
    }
};

module.exports = OfferList;
