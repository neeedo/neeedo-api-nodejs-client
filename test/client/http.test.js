/*
 * dependencies
 */
var http = require('../../client/http'),
    options = require('../../client/options'),
    should = require('should');

describe('#HttpAdapter', function() {
    it("can adapt to HTTPS", function() {
        var apiUrl = "https://something.tld";
        
        options.setApiUrl(apiUrl);
        
        http.isHttps().should.be.true;
    });

    it("can adapt to HTTP", function() {
        var apiUrl = "http://something.tld";

        options.setApiUrl(apiUrl);

        http.isHttps().should.be.false;
    });
});
