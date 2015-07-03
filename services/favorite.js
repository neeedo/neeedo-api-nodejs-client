var http = require('../client/http'),
    FavoriteModel = require('../models/favorite'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder'),
    _ = require('underscore');

/*
 * Class: Favorite
 *
 * This class realizes the connectivity to single favorite operations.
 */
function Favorite()
{
    this.apiEndpoint = '/favorites';
    
    this.addFavoriteOffer = function(favoriteModel, onSuccessCallback, onErrorCallback) {
        if (!_.isObject(favoriteModel)) {
            throw new Error("Type of favoriteModel must be object.");
        }

        // URL to mark messages as read
        var markMessageReadUrl = this.apiEndpoint;
        
        var json = favoriteModel.getQueryStringForApi();

        try {
            http.doPost(markMessageReadUrl, 
                json,
                function (response) {
                    var responseHandler = new ResponseHandler();

                    responseHandler.handle(
                        response,
                        function(completeData) {
                            // success on 200 OK
                            if (200 == response.statusCode) {
                                onSuccessCallback(favoriteModel);
                            } else {
                                errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.add_favorite_error,
                                    {"methodPath": "Service/Message::toggleRead()"});
                            }
                        },
                        function(error) {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.no_api_connection,
                                {"methodPath": "Service/Message::toggleRead()"});
                        }
                    )
                }, onErrorCallback,
                new OptionBuilder().addAuthorizationToken(favoriteModel.getUser()).getOptions());
        } catch (e) {
            errorHandler.newMessageAndLogError(onErrorCallback, messages.add_favorite_internal_error, e.message);
        }
    };


    /*
     * Function: deleteDemand
     * Triggers the deletion of a demand.
     *
     * - offerModel: see /models/offer.js
     * - onSuccessCallback: given function will be called with the originally given offerModel on success
     * - onErrorCallback: given function will be called with the /models/error.js instance
     */
    this.removeFavoriteOffer = function(favoriteModel, onSuccessCallback, onErrorCallback)
    {
        if (!_.isObject(favoriteModel)) {
            throw new Error("Type of favoriteModel must be object.");
        }

        var deleteOfferPath = this.apiEndpoint;
        var json = favoriteModel.getQueryStringForApi();
        
        try {
            http.doDelete(deleteOfferPath,
                function(response) {
                    // success on 200 = OK
                    if (200 == response.statusCode) {
                        onSuccessCallback(favoriteModel);
                    } else {
                        if (404 == response.statusCode) {
                            errorHandler.newMessageError(onErrorCallback, messages.favorite_not_found);
                        } else if (401 == response.statusCode) {
                            errorHandler.newMessageError(onErrorCallback, messages.login_wrong_credentials);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, "{}", messages.delete_favorite_error,
                                { "methodPath" : "Service/Favorite::removeFavoriteOffer()" });
                        }
                    }
                },
                onErrorCallback,
                new OptionBuilder()
                    .addAuthorizationToken(favoriteModel.getUser())
                    .add('deleteJson', json)
                    .getOptions());
        } catch (e) {
            errorHandler.newMessageAndLogError(onErrorCallback, messages.delete_favorite_internal_error, e.message);
        }
    };
}

/**
 * Function: toggleOfferFavorite
 *
 * Toggles the favorite state of the given offer - user pair.
 *
 * @param favorite see models/favorite the favorite object
 * @param onSuccessCallback will be called with models/favorite instance
 * @param onErrorCallback will be called with models/error instance
 */
Favorite.prototype.toggleOfferFavorite = function(favorite, onSuccessCallback, onErrorCallback) {
    if (!_.isObject(favorite)) {
        throw new Error("Type of favorite must be object.");
    }

    if (favorite.getUser().isFavoriteOffer(offer)) {
        this.removeFavoriteOffer(favorite, onSuccessCallback, onErrorCallback);
    } else {
        this.addFavoriteOffer(favorite, onSuccessCallback, onErrorCallback);
    }
};

module.exports = Favorite;
