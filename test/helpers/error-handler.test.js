/*
 * dependencies
 */
var errorHandler = require('../../helpers/error-handler.js'),
    credentialRemover = require('../../helpers/credential-remover.js'),
    should = require('should');

describe('#ErrorHandler', function() {
    it("generates expected log message when HTTP response is given", function() {
        var givenResponse = {
            "statusCode" : 400,
            "statusMessage" :  "Bad Request"
        };
        var givenJson = '{"username":"maxmuster","email":"max@muster.de","password":"maxmuster"}';
        var givenOptions = {
            "requestJson" : givenJson,
            "methodPath" : 'Service/Register::registerUser()'

        };
        
        var expectedLogMessage = "Service/Register::registerUser(): Neeedo API sent response 400 Bad Request\nRequest JSON was: "
            + credentialRemover.removeCredential(givenJson) + "\n\n";
        
        var resultJson = errorHandler.newError(givenResponse, 'not important', givenOptions).getLogMessages()[0];
        
        should.equal(expectedLogMessage, resultJson);
    });
});