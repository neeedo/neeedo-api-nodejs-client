var http = require('../client/http'),
    DemandModel = require('../models/demand'),
    Error = require('../models/error'),
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
    this.onSuccessCallback = undefined;
    this.onErrorCallback = undefined;
}

/*
 * Function: createDemand
 * Triggers the creation of a new demand.
 * 
 * - demandModel: see /models/demand.js
 * - onSuccessCallback: given function will be called with a given /models/offer.js object filled by the API
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Demand.prototype.createDemand = function(demandModel,onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;
    
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

                        _this.onSuccessCallback(createdDemand);
                    });
                } else {
                    var error = new Error();

                    error.setResponse(response)
                         .addErrorMessage(messages.create_demand_internal_error)
                         .addLogMessage('Service/Demand::createDemand(): Neeedo API sent response '
                              + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");


                    _this.onErrorCallback(error);
                }
                },
            {
            authorizationToken: demandModel.getUser().getAccessToken()
        });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.create_demand_internal_error));
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
Demand.prototype.updateDemand = function(demandModel,onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;

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

                        _this.onSuccessCallback(createdDemand);
                    });
                } else {
                    var error = new Error();

                    error.setResponse(response);
                    if (404 == response.statusCode) {
                        error.addErrorMessage(messages.demand_not_found);
                    } else if (401 == response.statusCode) {
                        error.addErrorMessage(messages.login_wrong_password);
                    } else {
                        error
                            .addErrorMessage(messages.update_demand_internal_error)
                            .addLogMessage('Service/Demand::updateDemand(): Neeedo API sent response '
                            + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");
                    }

                    _this.onErrorCallback(error);
                }
            },
        {
            authorizationToken: demandModel.getUser().getAccessToken()
        });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.update_demand_internal_error));
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
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;

    if (demandModel === null || typeof demandModel !== 'object') {
        throw new Error("Type of demandModel must be object.");
    }

    var deleteOfferPath = this.apiEndpoint + demandModel.getQueryStringForApi();
    var json = JSON.stringify(demandModel.serializeForApi());

    // closure
    var _this = this;
    try {
        http.doDelete(deleteOfferPath,
            function(response) {
                // success on 200 = OK
                if (200 == response.statusCode) {
                    _this.onSuccessCallback(demandModel);
                } else {
                    var error = new Error();

                    error.setResponse(response);
                    if (404 == response.statusCode) {
                        error.addErrorMessage(messages.demand_not_found);
                    } else if (401 == response.statusCode) {
                        error.addErrorMessage(messages.login_wrong_password);
                    } else {
                        error
                            .addErrorMessage(messages.delete_demand_internal_error)
                            .addLogMessage('Service/Demand::deleteDemand(): Neeedo API sent response '
                            + response.statusCode + ' ' + response.statusMessage + "\nRequest JSON was: " + json +"\n\n");
                    }

                    _this.onErrorCallback(error);
                }
            },
            {
                authorizationToken: demandModel.getUser().getAccessToken()
            });
    } catch (e) {
        this.onErrorCallback(new Error().addLogMessage(e.message).addErrorMessage(messages.delete_demand_internal_error));
    }
};

module.exports = Demand;