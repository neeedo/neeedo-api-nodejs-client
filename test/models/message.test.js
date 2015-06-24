/*
 * dependencies
 */
var Message = require('../../models/message.js'),
    User = require('../../models/user.js'),
    should = require('should');

describe('#Message', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a written message
        var senderId = "abcd1234";
        var recipientId = "efgh5678";
        
        var sender = new User().setId(senderId);
        var recipient = new User().setId(recipientId);
        var body = "This is a test message";
        
        var message = new Message()
            .setSender(sender)
            .setRecipient(recipient)
            .setBody(body);

        // when serializeForApi() is called
        var serializeObj = message.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['senderId'], senderId);
        should.equal(serializeObj['recipientId'], recipientId);
        should.equal(serializeObj['body'], body);
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
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

        // when loadFromSerialized is called
        var message = new Message().loadFromSerialized(neeedoMessageJson);

        // then the object should be loaded correctly...
        message.should.be.a.Object;
        should.equal(message.getId(), id);
        should.equal(message.getSender().getId(), senderId);
        should.equal(message.getSender().getUsername(), senderName);
        should.equal(message.getRecipient().getId(), recipientId);
        should.equal(message.getRecipient().getUsername(), recipientName);
        should.equal(message.getBody(), body);
        should.equal(message.getTimestamp(), timestamp);
        should.equal(message.wasRead(), read);
    });

    it("returns the expected query string", function() {
        var id = "12345";
        
        var message = new Message().setId(id);

        should.equal('/' + id, message.getQueryStringForApi());
    });
});
