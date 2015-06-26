/*
 * dependencies
 */
var User = require('./user'),
    Conversation = require('./conversation'),
    _ = require('underscore');

/*
 * Class: Message
 * 
 * This class models a Neeedo message.
 */
function Message()
{
    this.id = undefined;
    this.sender = undefined;
    this.recipient = undefined;
    this.body = undefined;
    this.timestamp = undefined;
    this.read = undefined;
}

Message.prototype.setId = function(id)
{
    if (!_.isString(id)) {
        throw new Error("Type of id must be string.");
    }
    
    this.id = id;
    return this;
};

Message.prototype.getId = function()
{
    return this.id;
};

Message.prototype.setSender = function(user)
{
    if (!_.isObject(user)) {
        throw new Error("Type of user must be object.");
    }
    
    this.sender = user;
    return this;
};

Message.prototype.getSender = function()
{
    if (undefined === this.sender) {
        this.sender = new User();
    }
    
    return this.sender;
};

Message.prototype.setRecipient = function(user)
{
    if (!_.isObject(user)) {
        throw new Error("Type of user must be object.");
    }

    this.recipient = user;
    return this;
};

Message.prototype.getRecipient = function()
{
    if (undefined === this.recipient) {
        this.recipient = new User();
    }

    return this.recipient;
};

Message.prototype.setBody = function(body)
{
    if (!_.isString(body)) {
        throw new Error("Type of body must be string.");
    }

    this.body = body;
    return this;
};

Message.prototype.getBody = function()
{
    return this.body;
};

Message.prototype.setTimestamp = function(timestamp)
{
    if (!_.isNumber(timestamp)) {
        throw new Error("Type of timestamp must be int.");
    }

    this.timestamp = timestamp;
    return this;
};

Message.prototype.getTimestamp = function()
{
    return this.timestamp;
};

Message.prototype.setRead = function(readFlag)
{
    if (!_.isBoolean(readFlag)) {
        throw new Error("Type of readFlag must be boolean.");
    }

    this.read = readFlag;
    return this;
};

Message.prototype.wasRead = function()
{
    return this.read;
};

Message.prototype.getConversation = function()
{
    var conversation = new Conversation();
    
    conversation
        .setSender(this.getSender())
        .setRecipient(this.getRecipient());
    
    return conversation;
};

/**
 * Function: getQueryStringForApi
 * Get the query string to be appended to the neeedo API endpoint URL in order to perform REST operations.
 */
Message.prototype.getQueryStringForApi = function()
{
    return "/" + this.getId();
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API (POST + PUT).
 */
Message.prototype.serializeForApi = function() {
    var _this = this;

    var serializedObj = {
       "senderId" :     _this.getSender().getId(),
       "recipientId" :     _this.getRecipient().getId(),
       "body" :   _this.getBody()
    };
    
    return serializedObj;
};
/*
 * Function: loadFromSerialized
 * Load the demand by the given serialized one.
 */
Message.prototype.loadFromSerialized = function(serializedMessage) {
    if (!_.isObject(serializedMessage)) {
        throw new Error("Type of serializedMessage must be object.");
    }
    
    if ("id" in serializedMessage) {
        this.setId(serializedMessage["id"]);
    }

    if ("sender" in serializedMessage) {
        this.setSender(new User().loadFromSerialized(serializedMessage["sender"]));
    }

    if ("recipient" in serializedMessage) {
        this.setRecipient(new User().loadFromSerialized(serializedMessage["recipient"]));
    }

    if ("body" in serializedMessage) {
        this.setBody(serializedMessage["body"]);
    }

    if ("timestamp" in serializedMessage) {
        this.setTimestamp(serializedMessage["timestamp"]);
    }

    if ("read" in serializedMessage) {
        this.setRead(serializedMessage["read"]);
    }

    return this;
};

module.exports = Message;
