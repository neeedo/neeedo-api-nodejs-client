var http = require('../client/http'),
    OfferModel = require('../models/offer'),
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

/*
 * Function: createOffer
 * Triggers the creation of a new offer.
 * 
 * - offerModel: see /models/offer.js
 * - onSuccessCallback: given function will be called with a given /models/offer.js object filled by the API
 * - onErrorCallback: given function will be called with the HTTP response object to trigger error handling
 */
Offer.prototype.createOffer = function(offerModel,onSuccessCallback, onErrorCallback)
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
                        
                        if (globalOptions.isDebugMode()) {
                            console.info("Services/Offer::createoffer(): server sent response data " + data);
                        }
                        
                        var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                        _this.onSuccessCallback(createdOffer);
                    });
                } else {
                    _this.onErrorCallback(response);
                }
            }, 
        {
            authorizationToken: offerModel.getUser().getAccessToken()
        });
    } catch (e) {
        onErrorCallback(e);
    }
};

/*
 * Function: updateOffer
 * Triggers the update of an offer.
 *
 * - offerModel: see /models/offer.js
 * - onSuccessCallback: given function will be called with a given /models/offer.js object filled by the API
 * - onErrorCallback: given function will be called with the HTTP response object to trigger error handling
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

                        if (globalOptions.isDebugMode()) {
                            console.info("Services/Offer::updateOffer(): server sent response data " + data);
                        }

                        var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                        _this.onSuccessCallback(createdOffer);
                    });
                } else {
                    _this.onErrorCallback(response);
                }
            },
        {
            authorizationToken: offerModel.getUser().getAccessToken()
        });
    } catch (e) {
        onErrorCallback(e);
    }
};

/*
 * Function: deleteOffer
 * Triggers the deletion of an offer.
 *
 * - offerModel: see /models/offer.js
 * - onSuccessCallback: given function will be called with the originally given offerModel on success
 * - onErrorCallback: given function will be called with the HTTP response object to trigger error handling
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
        http.doDelete(deleteOfferPath, json,
            function(response) {
                // success on 200 = OK
                if (200 == response.statusCode) {
                    _this.onSuccessCallback(offerModel);
                } else {
                    _this.onErrorCallback(response);
                }
            },
            {
                authorizationToken: offerModel.getUser().getAccessToken()
            });
    } catch (e) {
        onErrorCallback(e);
    }
};

/*
 * Function: addImageToOffer
 * Add an external image to the offer. Make sure that it was set on the given externalImage object.
 *
 * - externalImage: see /models/external-image.js
 * - onSuccessCallback: given function will be called with the associated offerModel on success
 * - onErrorCallback: given function will be called with the HTTP response object to trigger error handling
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

                        if (globalOptions.isDebugMode()) {
                            console.info("Services/Offer::addImageToOffer(): server sent response data " + data);
                        }

                        var createdOffer = new OfferModel().loadFromSerialized(offerData['offer']);

                        _this.onSuccessCallback(createdOffer);
                    });
                } else {
                    _this.onErrorCallback(response);
                }
            },
            {
                authorizationToken: externalImage.getAssociatedEntity().getUser().getAccessToken()
            });
    } catch (e) {
        onErrorCallback(e);
    }
};

module.exports = Offer;