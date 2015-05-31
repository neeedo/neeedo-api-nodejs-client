var http = require('../client/http'),
    DemandListModel = require('../models/demand-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

/*
 * Class: DemandList
 *
 * This class realizes the connectivity to Demand list services (multiple offers).
 */
function DemandList()
{
    this.apiEndpoint = '/demands';

    this.buildPaginationQueryString = function(offset, limit) {
        return "?from=" + offset + "&size=" + limit;
    }
}

/**
 * Function: loadByUser
 *
 * Load given user's demands.
 *
 * @param user
 * @param offset int
 * @param limit int
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
DemandList.prototype.loadByUser = function(user, offset, limit, onSuccessCallback, onErrorCallback)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }

    var getDemandByUserUrl = this.apiEndpoint + "/users/" + user.getId() + this.buildPaginationQueryString(offset, limit);

    try {
        http.doGet(getDemandByUserUrl,
            function(response) {
                var completeData = '';

                response.on('data', function(chunk) {
                    completeData += chunk;
                });

                response.on('end', function () {
                    // success on 200 OK
                    if (200 == response.statusCode) {
                        var demandsData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/DemandList::loadByUser(): server sent response data " + completeData);

                        var loadedDemandList = new DemandListModel().loadFromSerialized(demandsData['demands']);

                        onSuccessCallback(loadedDemandList);
                    } else {
                        errorHandler.newError(onErrorCallback, response, messages.get_demands_error,
                            { "methodPath" : "Service/DemandList::loadByUser()" });
                    }
                });

                response.on('error', function(error) {
                    errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                        { "methodPath" : "Services/DemandList::loadByUser()" });
                });
            }, onErrorCallback,
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_demands_internal_error, e.message);
    }
};

/**
 * Function: loadMostRecent
 *
 * Load most recent demands (PUBLIC action).
 *
 * @param offset int
 * @param limit int
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
DemandList.prototype.loadMostRecent = function(offset, limit, onSuccessCallback, onErrorCallback)
{
    if (offset !== parseInt(offset)) {
        throw new Error("Type of offset must be int.");
    }

    if (limit !== parseInt(limit)) {
        throw new Error("Type of limit must be int.");
    }

    var getMostRecentDemandsUrl = this.apiEndpoint + this.buildPaginationQueryString(offset, limit);

    try {
        http.doGet(getMostRecentDemandsUrl,
            function(response) {
                var completeData = '';
                // success on 200 OK

                response.on('data', function(chunk) {
                    completeData += chunk;
                });

                response.on('end', function () {
                    if (200 == response.statusCode) {
                        var demandsData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/DemandList::loadMostRecent(): server sent response data " + completeData);

                        var loadedDemandList = new DemandListModel().loadFromSerialized(demandsData['demands']);

                        onSuccessCallback(loadedDemandList);
                    }else {
                        errorHandler.newError(onErrorCallback, response, messages.get_most_recent_demands_error,
                            { "methodPath" : "Service/DemandList::loadMostRecent()" });
                    }
                });

                response.on('error', function(error) {
                    errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                        { "methodPath" : "Services/DemandList::loadMostRecent()" });
                });
            }, onErrorCallback, {});
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_most_recent_demands_error, e.message);
    }
};

module.exports = DemandList;
