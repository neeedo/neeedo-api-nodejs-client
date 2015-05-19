/*
 * dependencies
 */
var credentialRemover = require('../../helpers/credential-remover.js'),
    should = require('should');

describe('#CredentialRemover', function() {
    it("starifies password in JSON that will be logged", function() {
        var inputJson = '{"username":"maxmuster","email":"max@muster.de","password":"maxmuster"}';
        var expectedJson = '{"username":"maxmuster","email":"max@muster.de","password":"'+ credentialRemover.getStarifyStr() +'"}';
        
        var resultJson = credentialRemover.removeCredential(inputJson);
        
        should.equal(expectedJson, resultJson);
    });
});