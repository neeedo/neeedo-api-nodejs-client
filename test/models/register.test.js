/*
 * dependencies
 */
var Register = require('../../models/register.js'),
    should = require('should');

describe('#Register', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a registration
        var username = "maxmuster";
        var eMail = "max@mustermann.de";
        var password = "test1234";

        var register = new Register();
        register.setUsername(username);
        register.setEMail(eMail);
        register.setPassword(password);

        // when serializeForApi() is called
        var serializeObj = register.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['username'], username);
        should.equal(serializeObj['email'], eMail);
        should.equal(serializeObj['password'], password);
    });

    it("throws exception when loadFromSerialized is called", function() {
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            register.loadFromSerialized("")
        }
        ).should.throw();
    });
});