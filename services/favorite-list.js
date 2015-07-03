var http = require('../client/http'),
    OfferListModel = require('../models/offer-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    _ = require('underscore'),
    OptionBuilder = require('../helpers/option-builder');

/*
 * Class: FavoriteList
 *
 * This class realizes the connectivity to Offer favorites services (multiple offers).
 */
function FavoriteList()
{
    this.apiEndpoint = '/favorites';

    this.buildPaginationQueryString = function(offerQuery) {
        return offerQuery.buildQueryString();
    }
}

/**
 * Function: loadFavoritesOfUser
 *
 * Load given user's favorite offers.
 *
 * @param user
 * @param offerQueryModel see models/offer-query , currently not supported by API but we'll keep it here for future extensions
 * @param onSuccessCallback will be called with models/offer-list instance
 * @param onErrorCallback will be called with models/error instance
 */
FavoriteList.prototype.loadFavoritesOfUser = function(user, offerQueryModel, onSuccessCallback, onErrorCallback)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }

    if (!_.isObject(offerQueryModel)) {
        throw new Error("Type of offerQueryModel must be object.");
    }

    var getFavoritesOfUser = this.apiEndpoint + "/" + user.getId()  + this.buildPaginationQueryString(offerQueryModel);

    try {
        http.doGet(getFavoritesOfUser,
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

                        globalOptions.getLogger().info("Services/FavoriteList::loadFavoritesOfUser(): server sent response data " + completeData);

                        var loadedOfferList = new OfferListModel().loadFromSerialized(offersData['favorites']);

                        onSuccessCallback(loadedOfferList);
                    } else {
                        errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_favorite_offers_error,
                            { "methodPath" : "Service/FavoriteList::loadFavoritesOfUser()" });
                    }
                });

                response.on('error', function(error) {
                    // API not reachable
                    errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.no_api_connection,
                        {"methodPath": "Services/FavoriteList::loadFavoritesOfUser()"});
                });
            }, onErrorCallback,
            new OptionBuilder().addAuthorizationToken(user).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_favorite_offers_internal_error, e.message);
    }
};

module.exports = FavoriteList;
