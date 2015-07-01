/*
 * dependencies
 */
var Conversation = require('../../models/conversation.js'),
    should = require('should');

describe('#Conversation', function() {
    it("throws exception when serializeForApi is called", function() {
        var conversation = new Conversation();
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            conversation.loadFromSerialized("")
        }
        ).should.throw();
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        var userId = "12345";
        var username = "maxmuster";

        // given some JSON returned by the API
        var neeedoConversationJson =   {
            "id": userId,
            "name": username
        };

        // when loadFromSerialized is called
        var conversation = new Conversation();
        conversation.loadFromSerialized(neeedoConversationJson);

        // then the object should be loaded correctly...
        conversation.should.be.a.Object;
        should.equal(conversation.getSender().getId(), userId);
        should.equal(conversation.getSender().getUsername(), username);
    });
});
