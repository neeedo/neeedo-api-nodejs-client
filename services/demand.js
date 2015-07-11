var http = require('../client/http'),
    DemandModel = require('../models/demand'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder');

/*
 * Class: Demand
 *
 * This class realizes the connectivity to Demand CRUD operations.
 */
function Demand()
{
    this.apiEndpoint = '/demands';
}


Demand.prototype.load = function(demandId, user, onSuccessCallback, onErrorCallback)
{
    if ("string" !== typeof(demandId) ) {
        throw new Error("Type of demandId must be string.");
    }
    
    var getDemandIdUrl = this.apiEndpoint + "/" + demandId;

    try {
        http.doGet(getDemandIdUrl,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        // success on 200 OK
                        if (200 == response.statusCode) {
                            // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                            var demandData = JSON.parse(completeData);

                            var loadedDemand = new DemandModel().loadFromSerialized(demandData['demand']);

                            onSuccessCallback(loadedDemand); }
                        else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.register_internal_error,
                                { "methodPath" : "Service/Demand::load()" });
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                            {"methodPath": "Services/Demand::load()"});
                    }
                )
            },
            onErrorCallback,
            new OptionBuilder().addAuthorizationToken(user).getOptions()
        );
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_demand_internal_error, e.message);
    }
};

/*
 * Function: createDemand
 * Triggers the creation of a new demand.
 * 
 * - demandModel: see /models/demand.js
 * - onSuccessCallback: given function will be called with a given /models/offer.js object filled by the API
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Demand.prototype.createDemand = function(demandModel, onSuccessCallback, onErrorCallback)
{
    if (demandModel === null || typeof demandModel !== 'object') {
        throw new Error("Type of demandModel must be object.");
    }
    
    var createDemandUrlPath = this.apiEndpoint;
    var json = JSON.stringify(demandModel.serializeForApi());

    try {
        http.doPost(createDemandUrlPath, json,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        if (201 == response.statusCode) {
                            // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                            var demandData = JSON.parse(completeData);

                            var createdDemand = new DemandModel().loadFromSerialized(demandData['demand']);

                            onSuccessCallback(createdDemand);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.register_internal_error,
                                { "methodPath" : "Service/Demand::createDemand()",
                                    "requestJson" : json });
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                            { "methodPath" : "Services/Demand::createDemand()" });
                    }
                )
            },
            onErrorCallback,
            new OptionBuilder().addAuthorizationToken(demandModel.getUser()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.create_demand_internal_error, e.message);
    }
};

/*
 * Function: updateDemand
 * Triggers the update of an demand.
 *
 * - demandModel: see /models/demand.js
 * - onSuccessCallback: given function will be called with a given /models/offer.js object filled by the API
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Demand.prototype.updateDemand = function(demandModel, onSuccessCallback, onErrorCallback)
{
    if (demandModel === null || typeof demandModel !== 'object') {
        throw new Error("Type of registrationModel must be object.");
    }

    var updateDemandPath = this.apiEndpoint + demandModel.getQueryStringForApi();
    var json = JSON.stringify(demandModel.serializeForApi());

    try {
        http.doPut(updateDemandPath, json,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        // success on 200 = OK
                        if (200 == response.statusCode) {
                            // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#update-offer
                            var demandData = JSON.parse(completeData);

                            var createdDemand = new DemandModel().loadFromSerialized(demandData['demand']);

                            onSuccessCallback(createdDemand);
                        } else {
                            if (404 == response.statusCode) {
                                errorHandler.newMessageError(onErrorCallback, messages.demand_not_found);
                            } else if (401 == response.statusCode) {
                                errorHandler.newMessageError(onErrorCallback, messages.login_wrong_credentials);
                            } else {
                                errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.update_demand_internal_error,
                                    { "methodPath" : "Service/Demand::updateDemand()",
                                        "requestJson" : json });
                            }
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                            { "methodPath" : "Services/Demand::updateDemand()" });
                    }
                )
            },
            onErrorCallback,
            new OptionBuilder().addAuthorizationToken(demandModel.getUser()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.update_demand_internal_error, e.message);
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
Demand.prototype.deleteDemand = function(demandModel, onSuccessCallback, onErrorCallback)
{
    if (demandModel === null || typeof demandModel !== 'object') {
        throw new Error("Type of demandModel must be object.");
    }

    var deleteOfferPath = this.apiEndpoint + demandModel.getQueryStringForApi();

    try {
        http.doDelete(deleteOfferPath,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        // success on 200 = OK
                        if (200 == response.statusCode) {
                            onSuccessCallback(demandModel);
                        } else {
                            if (404 == response.statusCode) {
                                errorHandler.newMessageError(onErrorCallback, messages.demand_not_found);
                            } else if (401 == response.statusCode) {
                                errorHandler.newMessageError(onErrorCallback, messages.login_wrong_credentials);
                            } else {
                                errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.delete_demand_internal_error,
                                    { "methodPath" : "Service/Demand::delete()" });
                            }
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                            {"methodPath": "Services/Demand::delete()"});
                    }
                )
            },
            onErrorCallback,
            new OptionBuilder().addAuthorizationToken(demandModel.getUser()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.delete_demand_internal_error, e.message);
    }
};

module.exports = Demand;