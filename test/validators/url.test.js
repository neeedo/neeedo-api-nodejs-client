/*
 * dependencies
 */
var urlValidator = require('../../validators/url.js'),
    should = require('should');

describe('#isValidUrl', function() {
    it("throws an exception if no string value is given", function() {        
        var someNonStringInput = 1245;

        // wrap function to be called because it will be called later within should.throw()
        (function() {
              urlValidator.isValidUrl(someNonStringInput)
            }
         ).should.throw();
    });
    
    it("returns a boolean", function() {
       var someInput = "1235";
       urlValidator.isValidUrl(someInput).should.be.a.Boolean;
    });
    
    it("detects an URL without leading HTTP/HTTPS protocol as invalid", function() {
        var invalidUrlNoLeadingProt = 'neeedoapi.com';
        urlValidator.isValidUrl(invalidUrlNoLeadingProt).should.be.false;
    });

    it("detects an HTTP URL to IP + port as valid", function() {
        var validUrlIp = 'http://46.101.162.213:9000';
        urlValidator.isValidUrl(validUrlIp).should.be.true;
    });
    
    it("detects an HTTP URL to domain + port as valid", function() {
        var validUrlIp = 'http://neeedo-api.com:9000';
        urlValidator.isValidUrl(validUrlIp).should.be.true;
    });
});