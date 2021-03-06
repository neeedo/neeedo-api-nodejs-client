/*
 * dependencies
 */
var User = require('../../models/user.js'),
    should = require('should');

describe('#User', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a user with some ID
        var userId = "12345";
        var username = "maxmuster";
        var email = "max@muster.de";

        var user = new User();
        user.setId(userId);
        user.setUsername(username);
        user.setEMail(email);

        // when serializeForApi() is called
        var serializeObj = user.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['name'], username);
        should.equal(serializeObj['email'], email);
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        var userId = "12345";
        var version = 1;
        var username = "maxmuster";
        var email = "max@muster.de";

        // given some JSON returned by the API
        var neeedoUserJson = {
            "id": userId,
            "version": version,
            "name": username,
            "email" : email
        };

        // when loadFromSerialized is called
        var user = new User();
        user.loadFromSerialized(neeedoUserJson);

        // then the object should be loaded correctly...
        user.should.be.a.Object;
        should.equal(user.getId(), userId);
        should.equal(user.getVersion(), version);
        should.equal(user.getUsername(), username);
        should.equal(user.getEMail(), email);
    });

    it("is loaded correctly from session", function() {
        var userId = "12345";
        var version = 1;
        var username = "maxmuster";
        var email = "max@muster.de";
        var accessToken = "Zw1244124fasfawerf=";

        // given some JSON restored from session
        var userSessionDate = {
            "id": userId,
            "version": version,
            "name": username,
            "email" : email,
            "accessToken" : accessToken
        };

        // when loadFromSerialized is called
        var user = new User();
        user.loadFromSerialized(userSessionDate);

        // then the object should be loaded correctly...
        user.should.be.a.Object;
        should.equal(user.getId(), userId);
        should.equal(user.getVersion(), version);
        should.equal(user.getUsername(), username);
        should.equal(user.getEMail(), email);
        should.equal(user.getAccessToken(), accessToken);
    });
});