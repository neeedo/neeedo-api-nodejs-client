/*
 * dependencies
 */
var Favorite = require('../../models/favorite.js'),
    User = require('../../models/user.js'),
    Offer = require('../../models/offer.js'),
    should = require('should');

describe('#Message', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given certain's user's favorite
        var userId = "abcd1234";
        var offerId = "offer1234";
        
        var favorite = new Favorite();
        favorite.setOffer(new Offer().setId(offerId))
            .setUser(new User().setId(userId));

        // when serializeForApi() is called
        var serializeObj = favorite.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['userId'], userId);
        should.equal(serializeObj['offerId'], offerId);
    });

    it("throws exception when loadFromSerialized is called", function() {
        var favorite = new Favorite();
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            favorite.loadFromSerialized("");
        }
        ).should.throw();
    });
    
    it("throws exception when getQueryStringForApi is called", function() {
        var favorite = new Favorite();
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            favorite.getQueryStringForApi();
        }
        ).should.throw();
    });
});
