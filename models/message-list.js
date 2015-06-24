/*
 * dependencies
 */
var Message = require('./message')
    _ = require('underscore')
    ;

/*
 * Class: MessageList
 * 
 * This class models a Neeedo messages (multiple message instances).
 */
function MessageList()
{
    this.messages = [];
}

MessageList.prototype.getMessages = function()
{
    return this.messages;
};

MessageList.prototype.addMessage = function(message)
{
    this.messages.push(message);
    
    return this;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
MessageList.prototype.serializeForApi = function() {
   throw new Error('Not supported');
};

/*
 * Function: loadFromSerialized
 * Load the demand by the given serialized one.
 */
MessageList.prototype.loadFromSerialized = function(serializedMessages) {
    if (!_.isObject(serializedMessages)) {
        throw new Error("Type of serializedMessages must be object.");
    }
    
   this.messages = [];
    
   for (var i=0; i < serializedMessages.length; i++) {
     var serializedMessage = serializedMessages[i];
     this.addMessage(new Message().loadFromSerialized(serializedMessage));
   }

   return this;
};

module.exports = MessageList;
