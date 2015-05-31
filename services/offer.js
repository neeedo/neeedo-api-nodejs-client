var http = require('../client/http'),
    OfferModel = require('../models/offer'),
    errorHandler = require('../helpers/error-handler'),
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
}

Offer.prototype.load = function(offerId, user, onSuccessCallback, onErrorCallback)
{
    if ("string" !== typeof(offerId) ) {
        throw new Error("Type of offerId must be string.");
    }

    var getOfferUrl = this.apiEndpoint + "/" + offerId;

    try {
        http.doGet(getOfferUrl,
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

                            globalOptions.getLogger().info("Services/Offer::load(): server sent response data " + completeData);

                            var loadedOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                            onSuccessCallback(loadedOffer);
                        } else {
                            errorHandler.newError(onErrorCallback, response, messages.get_offer_error,
                                { "methodPath" : "Service/Offer::load()" });
                        }
                    });

                    response.on('error', function(error) {
                        errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                            { "methodPath" : "Services/Offer::load()" });
                    });
            },
            onErrorCallback,
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_offer_internal_error, e.message);
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
    if (offerModel === null || typeof offerModel !== 'object') {
        throw new Error("Type of offerModel must be object.");
    }
    
    var createOfferUrlPath = this.apiEndpoint;
    var json = JSON.stringify(offerModel.serializeForApi());

    try {
        http.doPost(createOfferUrlPath, json,
            function(response) {
                var completeData = '';              
                    response.on('data', function(chunk) {
                        completeData += chunk;
                    });
                    
                    response.on('end', function () {
                        // success on 201 = Created
                        if (201 == response.statusCode) {

                            // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                            var offerData = JSON.parse(completeData);

                            globalOptions.getLogger().info("Services/Offer::createoffer(): server sent response data " + completeData);

                            var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                            onSuccessCallback(createdOffer);
                        } else {
                            errorHandler.newError(onErrorCallback, response, messages.create_offer_internal_error,
                                { "methodPath" : "Service/Offer::createOffer()",
                                    "requestJson" : json });
                        }
                    });

                    response.on('error', function(error) {
                        errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                            { "methodPath" : "Services/Offer::createOffer()" });
                    });
            },
            onErrorCallback,
        {
            authorizationToken: offerModel.getUser().getAccessToken()
        });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.create_offer_internal_error, e.message);
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
Offer.prototype.updateOffer = function(offerModel, onSuccessCallback, onErrorCallback)
{
    if (offerModel === null || typeof offerModel !== 'object') {
        throw new Error("Type of registrationModel must be object.");
    }

    var updateOfferPath = this.apiEndpoint + offerModel.getQueryStringForApi();
    var json = JSON.stringify(offerModel.serializeForApi());

    try {
        http.doPut(updateOfferPath, json,
            function(response) {
                var completeData = '';                
                  
                    response.on('data', function(chunk) {
                        completeData += chunk;
                    });
                    
                    response.on('end', function () {
                        // success on 200 = OK
                        if (200 == response.statusCode) {
                            // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#update-offer
                            var offerData = JSON.parse(completeData);

                            globalOptions.getLogger().info("Services/Offer::updateOffer(): server sent response data " + completeData);

                            var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                            onSuccessCallback(createdOffer);
                        } else {
                            if (404 == response.statusCode) {
                                errorHandler.newMessageError(onErrorCallback, messages.offer_not_found);
                            } else if (401 == response.statusCode) {
                                errorHandler.newMessageError(onErrorCallback, messages.login_wrong_credentials);
                            } else {
                                errorHandler.newError(onErrorCallback, response, messages.update_offer_internal_error,
                                    { "methodPath" : "Service/Offer::updateOffer()",
                                        "requestJson" : json });
                            }
                        }
                    });

                    response.on('error', function(error) {
                        errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                            { "methodPath" : "Services/Offer::updateOffer()" });
                    });
            },
            onErrorCallback,
        {
            authorizationToken: offerModel.getUser().getAccessToken()
        });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.update_offer_internal_error, e.message);
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
Offer.prototype.deleteOffer = function(offerModel, onSuccessCallback, onErrorCallback)
{
    if (offerModel === null || typeof offerModel !== 'object') {
        throw new Error("Type of registrationModel must be object.");
    }

    var deleteOfferPath = this.apiEndpoint + offerModel.getQueryStringForApi();

    try {
        http.doDelete(deleteOfferPath,
            function(response) {
                // success on 200 = OK
                if (200 == response.statusCode) {
                   onSuccessCallback(offerModel);
                } else {
                    if (404 == response.statusCode) {
                        errorHandler.newMessageError(onErrorCallback, messages.offer_not_found);
                    } else if (401 == response.statusCode) {
                        errorHandler.newMessageError(onErrorCallback, messages.login_wrong_credentials);
                    } else {
                        errorHandler.newError(onErrorCallback, response, messages.delete_offer_internal_error,
                            { "methodPath" : "Service/Offer::deleteOffer()" });
                    }
                }
            },
            onErrorCallback,
            {
                authorizationToken: offerModel.getUser().getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.delete_offer_internal_error, e.message);
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
    if (externalImage === null || typeof externalImage !== 'object') {
        throw new Error("Type of externalImage must be object.");
    }

    var addImagePath = this.apiEndpoint + externalImage.getQueryStringForApi();
    var json = JSON.stringify(externalImage.serializeForApi());

    try {
        http.doPost(addImagePath, json,
            function(response) {
                var completeData = '';                
             
                    response.on('data', function(chunk) {
                        completeData += chunk;
                    });
                    
                    response.on('end', function () {
                        // success on 201 = Created
                        if (201 == response.statusCode) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#add-image-to-offer
                        var offerData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/Offer::addImageToOffer(): server sent response data " + completeData);

                        var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                        onSuccessCallback(createdOffer); 
                        } else {
                            errorHandler.newError(onErrorCallback, response, messages.add_image_to_offer_internal_error,
                                { "methodPath" : "Service/Offer::addImageToOffer()",
                                    "requestJson" : json });
                        }
                    });

                    response.on('error', function(error) {
                        errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                            { "methodPath" : "Services/Offer::addImageToOffer()" });
                    });
            },
            onErrorCallback,
            {
                authorizationToken: externalImage.getAssociatedEntity().getUser().getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.add_image_to_offer_internal_error, e.message);
    }
};

module.exports = Offer;