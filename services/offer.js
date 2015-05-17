var http = require('../client/http'),
    OfferModel = require('../models/offer'),
    Error = require('../models/error'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

/*
 * Class: Offer
 *
 * This class realizes the connectivity to Offer CRUD operations and related add external image.
 */
function Offer()
{
    this.apiEndpoint = '/offers';
    this.onSuccessCallback = undefined;
    this.onErrorCallback = undefined;
}

Offer.prototype.load = function(offerId, user, onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;

    if ("string" !== typeof(id) ) {
        throw new Error("Type of offerId must be string.");
    }

    var getOfferUrl = this.apiEndpoint + "/" + offerId;

    // closure
    var _this = this;
    try {
        http.doGet(getOfferUrl,
            function(response) {
                // success on 200 OK
                if (200 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                        var offerData = JSON.parse(data);

                        globalOptions.getLogger().info("Services/Offer::load(): server sent response data " + data);

                        var loadedOffer = new OfferModel().loadFromSerialized(offerData['offer']).setUser(user);

                        _this.onSuccessCallback(loadedOffer);
                    });
                } else {
                    var error = new Error();

                    error.setResponse(response)
                        .addErrorMessage(messages.get_offer_error)
                        .addLogMessage('Service/Offer::load(): Neeedo API sent response '
                        + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");

                    _this.onErrorCallback(error);
                }
            },
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.get_offer_internal_error));
    }
};

/*
 * Function: createOffer
 * Triggers the creation of a new offer.
 * 
 * - offerModel: see /models/offer.js
 * - onSuccessCallback: given function will be called with a given /models/offer.js object filled by the API
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Offer.prototype.createOffer = function(offerModel, onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;
    
    if (offerModel === null || typeof offerModel !== 'object') {
        throw new Error("Type of registrationModel must be object.");
    }
    
    var createOfferUrlPath = this.apiEndpoint;
    var json = JSON.stringify(offerModel.serializeForApi());
    
    // closure
    var _this = this;
    try {
        http.doPost(createOfferUrlPath, json,
            function(response) {
                // success on 201 = Created
                if (201 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                        var offerData = JSON.parse(data);

                        globalOptions.getLogger().info("Services/Offer::createoffer(): server sent response data " + data);
                        
                        var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                        _this.onSuccessCallback(createdOffer);
                    });
                } else {
                    var error = new Error();

                    error.setResponse(response)
                        .addErrorMessage(messages.create_offer_internal_error)
                        .addLogMessage('Service/Demand::createOffer(): Neeedo API sent response '
                        + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");

                    _this.onErrorCallback(error);
                }
            }, 
        {
            authorizationToken: offerModel.getUser().getAccessToken()
        });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.create_offer_internal_error));
    }
};

/*
 * Function: updateOffer
 * Triggers the update of an offer.
 *
 * - offerModel: see /models/offer.js
 * - onSuccessCallback: given function will be called with a given /models/offer.js object filled by the API
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Offer.prototype.updateOffer = function(offerModel,onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;

    if (offerModel === null || typeof offerModel !== 'object') {
        throw new Error("Type of registrationModel must be object.");
    }

    var updateOfferPath = this.apiEndpoint + offerModel.getQueryStringForApi();
    var json = JSON.stringify(offerModel.serializeForApi());

    // closure
    var _this = this;
    try {
        http.doPut(updateOfferPath, json,
            function(response) {
                // success on 200 = OK
                if (200 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#update-offer
                        var offerData = JSON.parse(data);

                        globalOptions.getLogger().info("Services/Offer::updateOffer(): server sent response data " + data);

                        var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                        _this.onSuccessCallback(createdOffer);
                    });
                } else {
                    var error = new Error();

                    error.setResponse(response);
                    if (404 == response.statusCode) {
                        error.addErrorMessage(messages.offer_not_found);
                    } else if (401 == response.statusCode) {
                        error.addErrorMessage(messages.login_wrong_password);
                    } else {
                        error
                            .addErrorMessage(messages.update_offer_internal_error)
                            .addLogMessage('Service/Demand::updateOffer(): Neeedo API sent response '
                            + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");
                    }

                    _this.onErrorCallback(error);
                }
            },
        {
            authorizationToken: offerModel.getUser().getAccessToken()
        });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.update_offer_internal_error));
    }
};

/*
 * Function: deleteOffer
 * Triggers the deletion of an offer.
 *
 * - offerModel: see /models/offer.js
 * - onSuccessCallback: given function will be called with the originally given offerModel on success
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Offer.prototype.deleteOffer = function(offerModel,onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;

    if (offerModel === null || typeof offerModel !== 'object') {
        throw new Error("Type of registrationModel must be object.");
    }

    var deleteOfferPath = this.apiEndpoint + offerModel.getQueryStringForApi();
    var json = JSON.stringify(offerModel.serializeForApi());

    // closure
    var _this = this;
    try {
        http.doDelete(deleteOfferPath,
            function(response) {
                // success on 200 = OK
                if (200 == response.statusCode) {
                    _this.onSuccessCallback(offerModel);
                } else {
                    var error = new Error();

                    error.setResponse(response);
                    if (404 == response.statusCode) {
                        error.addErrorMessage(messages.offer_not_found);
                    } else if (401 == response.statusCode) {
                        error.addErrorMessage(messages.login_wrong_password);
                    } else {
                        error
                            .addErrorMessage(messages.delete_offer_internal_error)
                            .addLogMessage('Service/Demand::deleteOffer(): Neeedo API sent response '
                            + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");
                    }

                    _this.onErrorCallback(error);
                }
            },
            {
                authorizationToken: offerModel.getUser().getAccessToken()
            });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.delete_offer_internal_error));
    }
};

/*
 * Function: addImageToOffer
 * Add an external image to the offer. Make sure that it was set on the given externalImage object.
 *
 * - externalImage: see /models/external-image.js
 * - onSuccessCallback: given function will be called with the associated offerModel on success
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Offer.prototype.addImageToOffer = function(externalImage,onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;

    if (externalImage === null || typeof externalImage !== 'object') {
        throw new Error("Type of externalImage must be object.");
    }

    var addImagePath = this.apiEndpoint + externalImage.getQueryStringForApi();
    var json = JSON.stringify(externalImage.serializeForApi());

    // closure
    var _this = this;
    try {
        http.doPost(addImagePath, json,
            function(response) {
                // success on 201 = Created
                if (201 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#add-image-to-offer
                        var offerData = JSON.parse(data);

                        globalOptions.getLogger().info("Services/Offer::addImageToOffer(): server sent response data " + data);

                        var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                        _this.onSuccessCallback(createdOffer);
                    });
                } else {
                    var error = new Error();
                    error.setResponse(response).addErrorMessage(messages.add_image_to_offer_internal_error);
                    error.addLogMessage('Service/Offer::addImageToOffer(): Neeedo API sent response '
                    + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");

                    _this.onErrorCallback(error);;
                }
            },
            {
                authorizationToken: externalImage.getAssociatedEntity().getUser().getAccessToken()
            });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.add_image_to_offer_internal_error));
    }
};

module.exports = Offer;