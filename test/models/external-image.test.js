/*
 * dependencies
 */
var ExternalImage = require('../../models/external-image.js'),
    Demand = require('../../models/demand.js'),
    Offer = require('../../models/offer.js'),
    should = require('should');

describe('#External Image', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given an image with some external URL
        var url = "http://groupelite.de/images/example.gif";
        var width = "400";
        var height = "400";

        var externalImage = new ExternalImage();
        externalImage.setUrl(url);
        externalImage.setWidth(width);
        externalImage.setHeight(height);

        // when serializeForApi() is called
        var serializeObj = externalImage.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['url'], url);
        should.equal(serializeObj['width'], width);
        should.equal(serializeObj['height'], height);
    });

    it("throws exception when loadFromSerialized is called", function() {
        var externalImage = new ExternalImage();
        // wrap function to be called because it will be called later within should.throw()
        (function() {
            externalImage.loadFromSerialized("")
        }
        ).should.throw();
    });

    it("throws exception when a non-object is set as associated value", function() {
        var externalImage = new ExternalImage();

        // wrap function to be called because it will be called later within should.throw()
        (function() {
            externalImage.setAssociatedEntity("this is a string");
        }
        ).should.throw();
    });

    it("throws exception when an unexpected object is set as associated value", function() {
        var externalImage = new ExternalImage();

        // wrap function to be called because it will be called later within should.throw()
        (function() {
            externalImage.setAssociatedEntity({"property" : "some value"});
        }
        ).should.throw();
    });

    it("throws no exception when a demand is set as associated value", function() {
        var externalImage = new ExternalImage();
        var someDemand = new Demand();

        externalImage.setAssociatedEntity(someDemand);
        
        should.ok(true);
    });

    it("throws no exception when an offer is set as associated value", function() {
        var externalImage = new ExternalImage();
        var someOffer = new Offer();

        externalImage.setAssociatedEntity(someOffer);
        
        should.ok(true);
    });
});
