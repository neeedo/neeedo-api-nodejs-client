var http = require('../client/http'),
    MessageListModel = require('../models/message-list'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder'),
    _ = require('underscore');

/*
 * Class: Message
 *
 * This class realizes the connectivity to single message operations.
 */
function Message()
{
    this.apiEndpoint = '/messages';
}

/**
 * Function: toggleRead
 *
 * Toggles the read flag state (was message read or not?). If previous set to 'true', it will be set to 'false' and vice versa.
 *
 * @param message see models/message
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
Message.prototype.toggleRead = function(message, onSuccessCallback, onErrorCallback) {
    if (!_.isObject(message)) {
        throw new Error("Type of message must be object.");
    }

    // TODO toggle the read state - ask API team to support wasRead parameter
    
    // URL to mark messages as read
    var markMessageReadUrl = this.apiEndpoint + "/" + message.getQueryStringForApi();

    try {
        http.doGet(markMessageReadUrl,
            function (response) {
                var responseHandler = new ResponseHandler();
                
                responseHandler.handle(
                    response, 
                    function(completeData) {
                        // success on 200 OK
                        if (200 == response.statusCode) {
                            onSuccessCallback(message);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.mark_message_read_error,
                                {"methodPath": "Service/Message::toggleRead()"});
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.no_api_connection,
                            {"methodPath": "Service/Message::toggleRead()"});
                    }
                )
            }, onErrorCallback,
            new OptionBuilder().addAuthorizationToken(message.getSender()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.mark_message_read_error, e.message);
    }
};

/**
 * Function: create
 *
 * Creates a message via API.
 *
 * @param message see models/message
 * @param onSuccessCallback will be called with models/demand-list instance
 * @param onErrorCallback will be called with models/error instance
 */
Message.prototype.create = function(message, onSuccessCallback, onErrorCallback) {
    if (!_.isObject(message)) {
        throw new Error("Type of message must be object.");
    }

    
    // URL to mark messages as read
    var createMessageUrl = this.apiEndpoint

    try {
        http.doPost(createMessageUrl,
            function (response) {
                var responseHandler = new ResponseHandler();
                
                responseHandler.handle(
                    response, 
                    function(completeData) {
                        // success on 200 OK or 201 Created
                        if (200 == response.statusCode || 201 == response.statusCode) {
                            var messageData = JSON.parse(completeData);

                            globalOptions.getLogger().info("Services/Message::create(): server sent response data " + completeData);

                            var createdMessage = new MessageListModel().loadFromSerialized(messageData['message']);

                            onSuccessCallback(createdMessage);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.create_message_error,
                                {"methodPath": "Service/Message::create()"});
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.no_api_connection,
                            {"methodPath": "Service/Message::create()"});
                    }
                )
            }, onErrorCallback,
            new OptionBuilder().addAuthorizationToken(message.getSender()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.create_message_error, e.message);
    }
};

module.exports = Message;
