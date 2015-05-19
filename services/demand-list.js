var http = require('../client/http'),
    DemandListModel = require('../models/demand-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

/*
 * Class: DemandList
 *
 * This class realizes the connectivity to Demand list services (multiple demands).
 */
function DemandList()
{
    this.apiEndpoint = '/demands';
}

/**
 * Function: loadByUser
 * 
 * Load given user's demands.
 *  
 * @param user
 * @param onSuccessCallback will be called with models/offer-list instance
 * @param onErrorCallback will be called with models/error instance
 */
DemandList.prototype.loadByUser = function(user, onSuccessCallback, onErrorCallback)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }

    var getDemandByUserUrl = this.apiEndpoint + "/users/" + user.getId();

    // closure
    var _this = this;
    try {
        http.doGet(getDemandByUserUrl,
            function(response) {
                // success on 200 OK
                if (200 == response.statusCode) {
                    var completeData = '';
                    response.on('data', function(chunk) {
                        completeData += chunk;
                    });

                    response.on('end', function () {
                        var demandsData = JSON.parse(completeData);

                        globalOptions.getLogger().info("Services/DemandList::loadByUser(): server sent response data " + completeData);

                        var loadedDemandList = new DemandListModel().loadFromSerialized(demandsData['demands']);

                        onSuccessCallback(loadedDemandList);
                    });
                } else {
                    errorHandler.newError(onErrorCallback, response, messages.get_offer_error,
                        { "methodPath" : "Service/DemandList::loadByUser()" });
                }
            },
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_offer_internal_error, e.message);
    }
};

module.exports = DemandList;