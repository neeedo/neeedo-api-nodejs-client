/*
 * dependencies
 */
var Location = require('../../models/location.js'),
    should = require('should');

describe('#Location', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a location with some lat, lng
        var lat = 13.534212;
        var lon = 52.468562;
        
        var location = new Location();
        location.setLatitude(lat)
                .setLongitude(lon);

        // when serializeForApi() is called
        var serializeObj = location.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['lat'], lat);
        should.equal(serializeObj['lon'], lon);
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        var lat = 13.534212;
        var lon = 52.468562;

        // given some JSON returned by the API
        var neeedoDemandJson = {
            "lat": lat,
            "lon": lon
        };

        // when loadFromSerialized is called
        var location = new Location();
        location.loadFromSerialized(neeedoDemandJson);

        // then the object should be loaded correctly...
        location.should.be.a.Object;
        should.equal(location.getLatitude(), lat);
        should.equal(location.getLongitude(), lon);
    });
});