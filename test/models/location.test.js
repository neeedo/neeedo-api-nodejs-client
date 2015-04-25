/*
 * dependencies
 */
var Location = require('../../models/location.js'),
    should = require('should');

describe('#serializeToApi', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        var lat = 13.534212;
        var lon = 52.468562;
        
        var location = new Location();
        location.setLatitude(lat)
                .setLongitude(lon);
        
        var serializeObj = location.serializeToApi();
        
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['lat'], lat);
        should.equal(serializeObj['lon'], lon);
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        var lat = 13.534212;
        var lon = 52.468562;
        
        var neeedoDemandJson = {
            "lat": lat,
            "lon": lon
        };

        var location = new Location();
        location.loadFromSerialized(neeedoDemandJson);

        location.should.be.a.Object;
        should.equal(location.getLatitude(), lat);
        should.equal(location.getLongitude(), lon);
    });
});