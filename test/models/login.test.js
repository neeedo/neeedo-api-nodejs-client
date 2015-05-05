/*
 * dependencies
 */
var Login = require('../../models/login.js'),
    should = require('should');

describe('#Login', function() {
    it("throws exception when serializeForApi is called", function() {
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            register.loadFromSerialized("")
        }
        ).should.throw();
    });

    it("throws exception when loadFromSerialized is called", function() {
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            register.loadFromSerialized("")
        }
        ).should.throw();
    });

    it("returns the correct query string to be appended to the API login endpoint URL", function() {
        var eMail = "max@mustermann.de";
        
        var loginModel = new Login();
        loginModel.setEMail(eMail);

        should.equal('/mail/' + eMail, loginModel.getQueryStringForApi());
    });
});