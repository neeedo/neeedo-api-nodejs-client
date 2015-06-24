/*
 * dependencies
 */
var ConversationQuery    = require('../../models/conversation-query.js'),
    should    = require('should');

describe('#ConversationQuery', function() {
    it("builds expected query string if all query parameters are given", function() {
        var conversationQuery = new ConversationQuery();
        conversationQuery
            .setReadFlag(true)
        ;

        should.equal('?read=true', conversationQuery.buildQueryString());
    });

    it("throws exception if mandatory parameters are not given", function() {
        var conversationQuery = new ConversationQuery();
        
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            conversationQuery.buildQueryString()
        }
        ).should.throw();
    });
});
