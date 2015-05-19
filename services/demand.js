var http = require('../client/http'),
    DemandModel = require('../models/demand'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

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

    // closure
    var _this = this;
    try {
        http.doGet(getDemandIdUrl,
            function(response) {
                // success on 200 OK
                if (200 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                        var demandData = JSON.parse(data);

                        globalOptions.getLogger().info("Services/Demand::load(): server sent response data " + data);

                        var loadedDemand = new DemandModel().loadFromSerialized(demandData['demand'])
                            .setUser(user);

                        onSuccessCallback(loadedDemand);
                    });
                } else {
                    onErrorCallback(errorHandler.newError(response, messages.register_internal_error,
                        { "methodPath" : "Service/Demand::load()" }));
                }
            },
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        onErrorCallback(errorHandler.newMessageAndLogError(messages.get_demand_internal_error, e.message));
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
    
    // closure
    var _this = this;
    try {
        http.doPost(createDemandUrlPath, json,
            function(response) {
                // success on 201 = Created
                if (201 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-offer
                        var demandData = JSON.parse(data);

                        globalOptions.getLogger().info("Services/Demand::createDemand(): server sent response data " + data);
                        
                        var createdDemand = new DemandModel().loadFromSerialized(demandData['demand']);

                        onSuccessCallback(createdDemand);
                    });
                } else {
                    onErrorCallback(errorHandler.newError(response, messages.register_internal_error,
                        { "methodPath" : "Service/Demand::createDemand()",
                            "requestJson" : json }));
                    }
                },
            {
            authorizationToken: demandModel.getUser().getAccessToken()
        });
    } catch (e) {
        onErrorCallback(errorHandler.newMessageAndLogError(messages.create_demand_internal_error, e.message));
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

    // closure
    var _this = this;
    try {
        http.doPut(updateDemandPath, json,
            function(response) {

                // success on 200 = OK
                if (200 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#update-offer
                        var demandData = JSON.parse(data);
                        
                        globalOptions.getLogger().info("Services/Demand::updateDemand(): server sent response data " + data);

                        var createdDemand = new DemandModel().loadFromSerialized(demandData['demand']);

                        onSuccessCallback(createdDemand);
                    });
                } else {
                    if (404 == response.statusCode) {
                        onErrorCallback(errorHandler.newMessageError(messages.demand_not_found));
                    } else if (401 == response.statusCode) {
                        onErrorCallback(errorHandler.newMessageError(messages.login_wrong_credentials));
                    } else {
                        onErrorCallback(errorHandler.newError(response, messages.update_demand_internal_error,
                            { "methodPath" : "Service/Demand::updateDemand()",
                                "requestJson" : json }));
                    }
                }
            },
        {
            authorizationToken: demandModel.getUser().getAccessToken()
        });
    } catch (e) {
        onErrorCallback(errorHandler.newMessageAndLogError(messages.update_demand_internal_error, e.message));
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
Demand.prototype.deleteDemand = function(demandModel,onSuccessCallback, onErrorCallback)
{
    if (demandModel === null || typeof demandModel !== 'object') {
        throw new Error("Type of demandModel must be object.");
    }

    var deleteOfferPath = this.apiEndpoint + demandModel.getQueryStringForApi();

    // closure
    var _this = this;
    try {
        http.doDelete(deleteOfferPath,
            function(response) {
                // success on 200 = OK
                if (200 == response.statusCode) {
                    onSuccessCallback(demandModel);
                } else {
                    if (404 == response.statusCode) {
                        onErrorCallback(errorHandler.newMessageError(messages.demand_not_found));
                    } else if (401 == response.statusCode) {
                        onErrorCallback(errorHandler.newMessageError(messages.login_wrong_credentials));
                    } else {
                        onErrorCallback(errorHandler.newError(response, messages.delete_demand_internal_error,
                            { "methodPath" : "Service/Login::loginUser()" }));
                    }
                }
            },
            {
                authorizationToken: demandModel.getUser().getAccessToken()
            });
    } catch (e) {
        onErrorCallback(errorHandler.newMessageAndLogError(messages.delete_demand_internal_error, e.message));
    }
};

module.exports = Demand;