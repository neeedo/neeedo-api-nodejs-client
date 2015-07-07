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
    // whether the favorite was removed on toggle action
    this.wasRemoved = false;
    // whether the favorite was added on toggle action
    this.wasAdded = false;
    
    this.apiEndpoint = '/favorites';
    
    this.addFavoriteOffer = function(favoriteModel, onSuccessCallback, onErrorCallback) {
        if (!_.isObject(favoriteModel)) {
            throw new Error("Type of favoriteModel must be object.");
        }

        // URL to mark messages as read
        var markMessageReadUrl = this.apiEndpoint;
        
        var json = JSON.stringify(favoriteModel.serializeForApi());
        
        var _this = this;
        try {
            http.doPost(markMessageReadUrl, 
                json,
                function (response) {
                    var responseHandler = new ResponseHandler();

                    responseHandler.handle(
                        response,
                        function(completeData) {
                            globalOptions.getLogger().info("Services/Favorite::addFavoriteOffer(): server sent response data " + completeData);
                            
                            // success on 200 Created
                            if (201 == response.statusCode) {
                                _this.wasAdded = true;
                                onSuccessCallback(favoriteModel);
                            } else {
                                errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.add_favorite_error,
                                    {"methodPath": "Service/Favorite::toggleRead()"});
                            }
                        },
                        function(error) {
                            errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                                {"methodPath": "Service/Favorite::toggleRead()"});
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

        var deleteOfferPath = this.apiEndpoint + favoriteModel.getQueryStringForApi;

        var _this = this;
        try {
            http.doDelete(deleteOfferPath,
                function(response) {
                    var responseHandler = new ResponseHandler();

                    responseHandler.handle(
                        response,
                        function(completeData) {
                            globalOptions.getLogger().info("Services/Favorite::removeFavoriteOffer(): server sent response data " + completeData);
                            
                            // success on 200 OK
                            if (200 == response.statusCode) {
                                _this.wasRemoved = true;
                                onSuccessCallback(favoriteModel);
                            } else {
                                if (404 == response.statusCode) {
                                    errorHandler.newMessageError(onErrorCallback, messages.favorite_not_found);
                                } else if (401 == response.statusCode) {
                                    errorHandler.newMessageError(onErrorCallback, messages.login_wrong_credentials);
                                } else {
                                    errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.delete_favorite_error,
                                        { "methodPath" : "Service/Favorite::removeFavoriteOffer()" });
                                }
                            }
                        },
                        function(error) {
                            errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                                {"methodPath": "Service/Favorite::Favorite()"});
                        }
                    )
                },
                onErrorCallback,
                new OptionBuilder()
                    .addAuthorizationToken(favoriteModel.getUser())
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

    if (favorite.getUser().isFavoriteOffer(favorite.getOffer())) {
        this.removeFavoriteOffer(favorite, onSuccessCallback, onErrorCallback);
    } else {
        this.addFavoriteOffer(favorite, onSuccessCallback, onErrorCallback);
    }
};

module.exports = Favorite;
