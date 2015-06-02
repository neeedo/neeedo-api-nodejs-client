/*
 * dependencies
 */
var Offer    = require('../../models/offer.js'),
    User      = require('../../models/user.js'),
    Location  = require('../../models/location.js'),
    ImageService = require('../../services/image'),
    should    = require('should');

var imageService = new ImageService();

describe('#Offer', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a demand with some data
        var offerId = "9dfa3c90-85c8-46ce-b50c-3ecde596bc90";
        var version = 1;
        var userId = "1";
        var user = new User().setId(userId);
        var tags = ["socken", "bekleidung", "wolle"];
        var lat = 35.92516;
        var lng = 12.37528;
        var location = new Location().setLatitude(lat).setLongitude(lng);
        var price = 25.0;
        var images = ["image1.jpg"];

        var offer = new Offer();
        offer.setId(offerId)
              .setVersion(version)
              .setUser(user)
              .setTags(tags)
              .setLocation(location)
              .setPrice(price)
              .setImageList(imageService.newImageList().loadFromSerialized(images));

        // when serializeForApi() is called
        var serializeObj = offer.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['userId'], userId);
        should.equal(serializeObj['tags'], tags);
        should.equal(serializeObj['location']['lat'], lat);
        should.equal(serializeObj['location']['lon'], lng);
        should.equal(serializeObj['price'], price);
        should.equal(JSON.stringify(serializeObj['images']), JSON.stringify(images));
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        var offerId = "9dfa3c90-85c8-46ce-b50c-3ecde596bc90";
        var version = 1;
        var userId = "1";
        var tags = ["socken", "bekleidung", "wolle"];
        var lat = 35.92516;
        var lng = 12.37528;
        var price = 25.0;
        var images = ["image1.jpg"];

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
            "price" : price,
            "images" : images
        };

        // when loadFromSerialized is called
        var offer = new Offer();
        offer.loadFromSerialized(neeedoOfferJson);

        // then the object should be loaded correctly...
        offer.should.be.a.Object;
        should.equal(offer.getId(), offerId);
        should.equal(offer.getVersion(), version);
        should.equal(offer.getUser().getId(), userId);
        should.equal(offer.getTags(), tags);
        should.equal(offer.getLocation().getLatitude(), lat);
        should.equal(offer.getLocation().getLongitude(), lng);
        should.equal(offer.getPrice(), price);
        should.equal(JSON.stringify(offer.getImageList().serializeForApi()), JSON.stringify(images));
    });

    it("has appropriate default values", function() {
        var offer = new Offer();

        offer.getImages().should.be.Array;
    });
});