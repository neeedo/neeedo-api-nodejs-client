/*
 * dependencies
 */
var MessageList    = require('../../models/message-list.js'),
    should    = require('should');

describe('#MessageList', function() {
    it("throws exception when serializeForApi is called", function() {
        var messageList = new MessageList();
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            messageList.loadFromSerialized("")
        }
        ).should.throw();
    });
    
    it("is loaded correctly from neeedo API Conversation JSON", function() {
        var id = "12345";
        var senderId = "abcd1234";
        var senderName = "maxmuster";
        var recipientId = "efgh5678";
        var recipientName = "torben";
        var body = "This is a test message";
        var timestamp = 1434802592926;
        var read = true;

        // given some JSON returned by the API
        var neeedoMessageJson = {
            "id": id,
            "sender": {
                "id": senderId,
                "name": senderName
            },
            "recipient": {
                "id": recipientId,
                "name": recipientName
            },
            "body": body,
            "timestamp": timestamp,
            "read": read
        };

        var incomingJson = [neeedoMessageJson, neeedoMessageJson];

        // when loadFromSerialized is called
        var messageList = new MessageList();
        messageList.loadFromSerialized(incomingJson);

        // then the object should be loaded correctly...
        messageList.should.be.a.Object;
        should.equal(messageList.getMessages().length, 2);

        var firstMessage = messageList.getMessages()[0];

        should.equal(firstMessage.getId(), id);
        should.equal(firstMessage.getSender().getId(), senderId);
        should.equal(firstMessage.getSender().getUsername(), senderName);
        should.equal(firstMessage.getRecipient().getId(), recipientId);
        should.equal(firstMessage.getRecipient().getUsername(), recipientName);
        should.equal(firstMessage.getBody(), body);
        should.equal(firstMessage.getTimestamp(), timestamp);
        should.equal(firstMessage.wasRead(), read);
    });
});
