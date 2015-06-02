/*
 * dependencies
 */
var ImageList    = require('../../models/image-list'),
    Image    = require('../../models/image'),
    should    = require('should');

describe('#ImageList', function() {
    it("is loaded correctly from neeedo API Demand JSON", function() {
        var images = ["image1.jpg", "image2.jpg", "image3.jpg"];
      
        // when loadFromSerialized is called
        var imageList = new ImageList("http://some-base-url.de");
        imageList.loadFromSerialized(images);

        // then the object should be loaded correctly...
        should.equal(imageList.getImages().length, 3);
        
        var firstImage = imageList.getImages()[0];
        
        should.equal(firstImage.getFileName(), "image1.jpg");
        should.equal(firstImage.getUrl(), "http://some-base-url.de/image1.jpg");
    });

    it("generates the expected serialization object to be sent to neeedo API", function() {
        var images = ["image1.jpg", "image2.jpg", "image3.jpg"];

        // when loadFromSerialized is called
        var imageList = new ImageList("http://some-base-url.de");
        
        imageList.addImage(new Image("http://some-base-url.de").setFileName("image1.jpg"))
            .addImage(new Image("http://some-base-url.de").setFileName("image2.jpg"))
            .addImage(new Image("http://some-base-url.de").setFileName("image3.jpg"));

        should.equal(JSON.stringify(imageList.serializeForApi()), JSON.stringify(images));
    });
});