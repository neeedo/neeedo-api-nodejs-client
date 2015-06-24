var http = require('../client/http'),
    MessageListModel = require('../models/message-list'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder'),
    _ = require('underscore');

/*
 * Class: Demand
 *
 * This class realizes the connectivity to message list Get operations.
 */
function MessageList()
{
    this.apiEndpoint = '/messages';
}

/**
 * Function: loadByConversation
 *
 * Load messages of a given models/conversation .
 *
 * @param conversation see models/conversation
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
MessageList.prototype.loadByConversation = function(conversation, onSuccessCallback, onErrorCallback) {
    if (!_.isObject(conversation)) {
        throw new Error("Type of conversation must be object.");
    }

    // URL to get messages consists of senderId/recipientId
    var getMessages = this.apiEndpoint + "/" + conversation.getSender().getId() + "/" + conversation.getRecipient().getId();

    try {
        http.doGet(getMessages,
            function (response) {
                var responseHandler = new ResponseHandler();
                
                responseHandler.handle(
                    response, 
                    function(completeData) {
                        // success on 200 OK
                        if (200 == response.statusCode) {
                            var messagesData = JSON.parse(completeData);

                            globalOptions.getLogger().info("Services/MessageList::loadByConversation(): server sent response data " + completeData);

                            var loadedMessages = new MessageListModel().loadFromSerialized(messagesData['messages']);

                            onSuccessCallback(loadedMessages);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.get_messages_error,
                                {"methodPath": "Service/MessageList::loadByConversation()"});
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.no_api_connection,
                            {"methodPath": "Services/MessageList::loadByConversation()"});
                    }
                )
            }, onErrorCallback,
            new OptionBuilder().addAuthorizationToken(conversation.getSender()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.get_conversations_error, e.message);
    }
};

module.exports = MessageList;
