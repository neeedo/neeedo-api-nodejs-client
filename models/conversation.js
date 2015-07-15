var User = require('./user'),
    _ = require('underscore')
    ;

/*
 * Class: Conversation
 *
 * This class models a Neeedo conversation.
 * 
 * Currently, a conversation is a simple list of user objects (recipients of the user who was querying the conversations).
 */
function Conversation()
{
    this.recipient = undefined;
    this.sender = undefined;
}

Conversation.prototype.setRecipient = function(recipient)
{
    if (!_.isObject(recipient) ) {
        throw new Error("Type of recipient must be object.");
    }

    this.recipient = recipient;
    return this;
};

Conversation.prototype.getRecipient = function()
{
    return this.recipient;
};

Conversation.prototype.setSender = function(sender)
{
    if (!_.isObject(sender) ) {
        throw new Error("Type of sender must be object.");
    }

    this.sender = sender;
    return this;
};

Conversation.prototype.getSender = function()
{
    return this.sender;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Conversation.prototype.serializeForApi = function() {
    throw new Error('Not supported');
};

/*
 * Function: loadFromSerialized
 * Load the object by the given serialized one.
 */
Conversation.prototype.loadFromSerialized = function(serializedConversation) {
    if (!_.isObject(serializedConversation)) {
        throw new Error("Type of serializedConversation must be object.");
    }

    var expectedStructureGiven = false;
    if ("recipient" in serializedConversation) {
        this.setRecipient(new User().loadFromSerialized(serializedConversation["recipient"]));
        expectedStructureGiven = true;
    }
    
    if ("sender" in serializedConversation) {
        this.setSender(new User().loadFromSerialized(serializedConversation["sender"]));
        expectedStructureGiven = true;
    }
    
    if (!expectedStructureGiven) {
        // currently, we only delegate to the user object - a conversation does not have any other fields yet
        this.setSender(new User().loadFromSerialized(serializedConversation));
    }

    return this;
};

Conversation.prototype.equals = function(otherConversation) {
    return this.getSender().getId() == otherConversation.getSender().getId()
        && this.getRecipient().getId() == otherConversation.getRecipient().getId();
};

module.exports = Conversation;
