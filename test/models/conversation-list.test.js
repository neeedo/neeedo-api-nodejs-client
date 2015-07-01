/*
 * dependencies
 */
var ConversationList    = require('../../models/conversation-list.js'),
    should    = require('should');

describe('#ConversationList', function() {
    it("throws exception when serializeForApi is called", function() {
        var conversationList = new ConversationList();
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            conversationList.loadFromSerialized("")
        }
        ).should.throw();
    });
    
    it("is loaded correctly from neeedo API Conversation JSON", function() {
        var userId1 = "abcd1234";
        var userName1 = "maxmuster";

        var userId2 = "efgh5678";
        var userName2 = "torben";

        // given some JSON returned by the API
        var neeedoConversationJson1 =  {
            "id": userId1,
            "name": userName1
        };
        var neeedoConversationJson2 =  {
            "id": userId2,
            "name": userName2
        };

        var incomingJson = [neeedoConversationJson1, neeedoConversationJson2];
      
        // when loadFromSerialized is called
        var conversationList = new ConversationList();
        conversationList.loadFromSerialized(incomingJson);

        // then the object should be loaded correctly...
        conversationList.should.be.a.Object;
        should.equal(conversationList.getConversations().length, 2);
        
        var firstConversation = conversationList.getConversations()[0];
        
        should.equal(firstConversation.getSender().getId(), userId1);
        should.equal(firstConversation.getSender().getUsername(), userName1);
        
        var secondConversation = conversationList.getConversations()[1];
        
        should.equal(secondConversation.getSender().getId(), userId2);
        should.equal(secondConversation.getSender().getUsername(), userName2);
    });
});
