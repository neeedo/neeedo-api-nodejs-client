var http = require('../client/http'),
    DemandListModel = require('../models/demand-list'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    _ = require('underscore'),
    OptionBuilder = require('../helpers/option-builder');

/*
 * Class: DemandList
 *
 * This class realizes the connectivity to Demand list services (multiple offers).
 */
function DemandList()
{
    this.apiEndpoint = '/demands';

    this.buildQueryString = function(demandQueryModel) {
        return demandQueryModel.buildQueryString();
    }
}

/**
 * Function: loadByUser
 *
 * Load given user's demands.
 *
 * @param user
 * @param demandQueryModel see models/demand-query
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
DemandList.prototype.loadByUser = function(user, demandQueryModel, onSuccessCallback, onErrorCallback)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }

    if (!_.isObject(demandQueryModel)) {
        throw new Error("Type of demandQueryModel must be object.");
    }

    var getDemandByUserUrl = this.apiEndpoint + "/users/" + user.getId() + this.buildQueryString(demandQueryModel);

    try {
        http.doGet(getDemandByUserUrl,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        // success on 200 OK
                        if (200 == response.statusCode) {
                            var demandsData = JSON.parse(completeData);

                            var loadedDemandList = new DemandListModel().loadFromSerialized(demandsData['demands']);

                            onSuccessCallback(loadedDemandList);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_demands_error,
                                { "methodPath" : "Service/DemandList::loadByUser()" });
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.get_demands_error,
                            { "methodPath" : "Service/DemandList::loadByUser()" });
                    }
                )
            }, onErrorCallback,
            new OptionBuilder().addAuthorizationToken(user).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_demands_internal_error, e.message);
    }
};

/**
 * Function: loadMostRecent
 *
 * Load most recent demands (PUBLIC action).
 *
 * @param demandQueryModel see models/demand-query
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
DemandList.prototype.loadMostRecent = function(demandQueryModel, onSuccessCallback, onErrorCallback)
{
    if (!_.isObject(demandQueryModel)) {
        throw new Error("Type of demandQueryModel must be object.");
    }

    var getMostRecentDemandsUrl = this.apiEndpoint + this.buildQueryString(demandQueryModel);

    try {
        http.doGet(getMostRecentDemandsUrl,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        if (200 == response.statusCode) {
                            var demandsData = JSON.parse(completeData);

                            var loadedDemandList = new DemandListModel().loadFromSerialized(demandsData['demands']);

                            onSuccessCallback(loadedDemandList);
                        }else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_most_recent_demands_error,
                                { "methodPath" : "Service/DemandList::loadMostRecent()" });
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                            { "methodPath" : "Services/DemandList::loadMostRecent()" });
                    }
                )
            }, onErrorCallback, {});
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_most_recent_demands_error, e.message);
    }
};

module.exports = DemandList;
