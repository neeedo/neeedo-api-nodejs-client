/*
 * dependencies
 */
var User = require('../../models/user.js'),
    should = require('should');

describe('#User', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a user with some ID
        var userId = "12345";

        var user = new User();
        user.setId(userId);

        // when serializeForApi() is called
        var serializeObj = user.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['id'], userId);
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        userId = "12345";
        
        // given some JSON returned by the API
        var neeedoUserJson = {
            "id": userId
        };

        // when loadFromSerialized is called
        var user = new User();
        user.loadFromSerialized(neeedoUserJson);

        // then the object should be loaded correctly...
        user.should.be.a.Object;
        should.equal(user.getId(), userId);
    });
});