/*
 * dependencies
 */
var User = require('../../models/user.js'),
    OptionBuilder = require('../../helpers/option-builder.js'),
    should = require('should');

describe('#OptionBuilder', function() {
    it("builds the expected option object to be handed to Http client", function() {
        var givenUser = new User().setAccessToken('anAccessToken');

        var buildedOptions = new OptionBuilder().addAuthorizationToken(givenUser).getOptions();
        
        should.equal(JSON.stringify({authorizationToken : 'anAccessToken'}), JSON.stringify(buildedOptions));
    });

    it("skips building of authorization token if user is undefined", function() {
        var givenUser = undefined;

        var buildedOptions = new OptionBuilder().addAuthorizationToken(givenUser).getOptions();

        should.equal(JSON.stringify({}), JSON.stringify(buildedOptions));
    });
});