/*
 * dependencies
 */
var OfferList    = require('../../models/offer-list.js'),
    should    = require('should');

describe('#OfferList', function() {
    it("is loaded correctly from neeedo API Demand JSON", function() {
        var offerId = "9dfa3c90-85c8-46ce-b50c-3ecde596bc90";
        var version = 1;
        var userId = "1";
        var tags = ["socken", "bekleidung", "wolle"];
        var lat = 35.92516;
        var lng = 12.37528;
        var price = 25.0;
        
        // given some JSON returned by the API
        var neeedoOfferJson = {
            "id": offerId,
            "version": version,
            "userId": userId,
            "tags": tags,
            "location": {
                "lat": lat,
                "lon": lng
            },
            "price" : price
        };

        var incomingJson = [neeedoOfferJson, neeedoOfferJson];
      
        // when loadFromSerialized is called
        var offerList = new OfferList();
        offerList.loadFromSerialized(incomingJson);

        // then the object should be loaded correctly...
        offerList.should.be.a.Object;
        should.equal(offerList.getOffers().length, 2);
        
        var firstOffer = offerList.getOffers()[0];
        
        should.equal(firstOffer.getId(), offerId);
        should.equal(firstOffer.getVersion(), version);
        should.equal(firstOffer.getUser().getId(), userId);
        should.equal(firstOffer.getTags(), tags);
        should.equal(firstOffer.getLocation().getLatitude(), lat);
        should.equal(firstOffer.getLocation().getLongitude(), lng);
        should.equal(firstOffer.getPrice(), price);
    });
});