var http = require('../client/http'),
    ConversationListModel = require('../models/conversation-list'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder'),
    _ = require('underscore');

/*
 * Class: Demand
 *
 * This class realizes the connectivity to Conversation Get operations.
 */
function ConversationList()
{
    this.apiEndpoint = '/conversations';

    this.buildQueryString = function(conversationQuery) {
        return conversationQuery.buildQueryString();
    }
}

/**
 * Function: loadBySender
 *
 * Load given user's conversations with other users.
 *
 * @param user see models/user
 * @param conversationQuery see models/conversation-query
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
ConversationList.prototype.loadBySender = function(user, conversationQuery, onSuccessCallback, onErrorCallback) {
    if (!_.isObject(user)) {
        throw new Error("Type of user must be object.");
    }

    if (!_.isObject(conversationQuery)) {
        throw new Error("Type of conversationQuery must be object.");
    }

    var getSendersConversations = this.apiEndpoint + "/" + user.getId() + this.buildQueryString(conversationQuery);

    try {
        http.doGet(getSendersConversations,
            function (response) {
                var responseHandler = new ResponseHandler();
                
                responseHandler.handle(
                    response, 
                    function(completeData) {
                        // success on 200 OK
                        if (200 == response.statusCode) {
                            var conversationsData = JSON.parse(completeData);

                            globalOptions.getLogger().info("Services/ConversationList::loadBySender(): server sent response data " + completeData);

                            var loadedConversationList = new ConversationListModel()
                                .setRecipient(user)
                                .loadFromSerialized(conversationsData['users']);

                            onSuccessCallback(loadedConversationList);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_conversations_error,
                                {"methodPath": "Service/ConversationList::loadBySender()"});
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.no_api_connection,
                            {"methodPath": "Services/ConversationList::loadBySender()"});
                    }
                )
            }, onErrorCallback,
            new OptionBuilder().addAuthorizationToken(user).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_conversations_error, e.message);
    }
};

module.exports = ConversationList;
