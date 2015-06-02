/*
 * dependencies
 */
var Image    = require('../../models/image.js'),
    should    = require('should');


describe('#Image', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a demand with some data
        var image = new Image("http://some-base-url.de")
            .setFileName("image.jpg");

        // when serializeForApi() is called
        var serializeObj = image.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        should.equal(serializeObj, "image.jpg");
    });

    it("is loaded correctly from neeedo API Demand JSON with correct absolute URL", function() {
        var imageName = "image.jpg";

        // when loadFromSerialized is called
        var image = new Image("http://some-base-url.de");
        image.loadFromSerialized(imageName);

        // then the object should be loaded correctly...
        image.should.be.a.Object;
        should.equal(image.getFileName(), imageName);
        should.equal(image.getUrl(), "http://some-base-url.de/image.jpg");
    });
});
