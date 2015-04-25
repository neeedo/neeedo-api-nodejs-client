/*
 * dependencies
 */
var Price = require('../../../models/demand/price.js'),
    should = require('should');

describe('#Price', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a location with some lat, lng
        var min = 25.0;
        var max = 77.0;
        
        var price = new Price();
        price.setMin(min)
             .setMax(max);

        // when serializeForApi() is called
        var serializeObj = price.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['min'], min);
        should.equal(serializeObj['max'], max);
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        var min = 25.0;
        var max = 77.0;

        // given some JSON returned by the API
        var neeedPriceJson = {
            "min": min,
            "max": max
        };

        // when loadFromSerialized is called
        var price = new Price();
        price.loadFromSerialized(neeedPriceJson);

        // then the object should be loaded correctly...
        price.should.be.a.Object;
        should.equal(price.getMin(), min);
        should.equal(price.getMax(), max);
    });
});