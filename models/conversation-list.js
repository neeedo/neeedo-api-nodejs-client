/*
 * dependencies
 */
var Conversation = require('./conversation'),
    _ = require('underscore')
    ;

/*
 * Class: ConversationList
 * 
 * This class models a Neeedo conversation list (multiple conversation instances).
 */
function ConversationList()
{
    this.conversations = [];
    this.sender = undefined;
    this.recipient = undefined;
}

ConversationList.prototype.getConversations = function()
{
    return this.conversations;
};

ConversationList.prototype.addConversation = function(conversation)
{
    this.conversations.push(conversation);

    return this;
};

ConversationList.prototype.setSender = function(sender)
{
    if (!_.isObject(sender) ) {
        throw new Error("Type of sender must be object.");
    }

    this.sender = sender;
    return this;
};

ConversationList.prototype.getSender = function()
{
    return this.sender;
};

ConversationList.prototype.setRecipient = function(recipient)
{
    if (!_.isObject(recipient) ) {
        throw new Error("Type of recipient must be object.");
    }

    this.recipient = recipient;
    return this;
};

ConversationList.prototype.getRecipient = function()
{
    return this.recipient;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
ConversationList.prototype.serializeForApi = function() {
    throw new Error('Not supported');
};

/*
 * Function: loadFromSerialized
 * Load the demand by the given serialized one.
 */
ConversationList.prototype.loadFromSerialized = function(serializedConversations) {
    if (!_.isObject(serializedConversations)) {
        throw new Error("Type of serializedConversations must be object.");
    }

    this.conversations = [];

    for (var i=0; i < serializedConversations.length; i++) {
        var serializedConversation = serializedConversations[i];
        var conversation = new Conversation().loadFromSerialized(serializedConversation);
        
        if (undefined !== this.getSender()) {
            conversation.setSender(this.getSender());
        }
        if (undefined !== this.getRecipient()) {
            conversation.setRecipient(this.getRecipient());
        }

        this.addConversation(conversation);
    }

    return this;
};

module.exports = ConversationList;
