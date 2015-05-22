/*
 * dependencies
 */
var Demand    = require('../../models/demand.js'),
    User      = require('../../models/user.js'),
    Location  = require('../../models/location.js'),
    Price     = require('../../models/demand/price.js'),
    should    = require('should');

describe('#Demand', function() {
    it("generates the expected serialization object to be sent to neeedo API", function() {
        // given a demand with some data
        var demandId = "c1ef9724-935e-4455-854e-96b99eec555d";
        var version = 1;
        var userId = "1";
        var user = new User().setId(userId);
        var mustTags = ["iphone"];
        var shouldTags = ["neuwertig","schwarz"];
        var lat = 35.92516;
        var lng = 12.37528;
        var location = new Location().setLatitude(lat).setLongitude(lng);
        var distance = 30;
        var min = 25.0;
        var max = 77.0;
        var price = new Price().setMin(min).setMax(max);

        var demand = new Demand();
        demand.setId(demandId)
              .setVersion(version)
              .setUser(user)
              .setMustTags(mustTags)
              .setShouldTags(shouldTags)
              .setLocation(location)
              .setDistance(distance)
              .setPrice(price);

        // when serializeForApi() is called
        var serializeObj = demand.serializeForApi();

        // a plain javascript object with the following fields should be returned...
        serializeObj.should.be.a.Object;
        should.equal(serializeObj['userId'], userId);
        should.equal(serializeObj['mustTags'], mustTags);
        should.equal(serializeObj['shouldTags'], shouldTags);
        should.equal(serializeObj['location']['lat'], lat);
        should.equal(serializeObj['location']['lon'], lng);
        should.equal(serializeObj['distance'], distance);
        should.equal(serializeObj['price']['min'], min);
        should.equal(serializeObj['price']['max'], max);
    });

    it("is loaded correctly from neeedo API Demand JSON", function() {
        var demandId = "c1ef9724-935e-4455-854e-96b99eec555d";
        var version = 1;
        var userId = "1";
        var mustTags = ["iphone"];
        var shouldTags = ["neuwertig","schwarz"];
        var lat = 35.92516;
        var lng = 12.37528;
        var distance = 30;
        var min = 25.0;
        var max = 77.0;

        // given some JSON returned by the API
        var neeedoDemandJson = {
            "id": demandId,
            "version": version,
            "userId": userId,
            "mustTags": mustTags,
            "shouldTags": shouldTags,
            "location": {
                "lat": lat,
                "lon": lng
            },
            "distance": distance,
            "price" : {
                "min" : min,
                "max" : max
            }
        };

        // when loadFromSerialized is called
        var demand = new Demand();
        demand.loadFromSerialized(neeedoDemandJson);

        // then the object should be loaded correctly...
        demand.should.be.a.Object;
        should.equal(demand.getId(), demandId);
        should.equal(demand.getVersion(), version);
        should.equal(demand.getUser().getId(), userId);
        should.equal(demand.getMustTags(), mustTags);
        should.equal(demand.getShouldTags(), shouldTags);
        should.equal(demand.getLocation().getLatitude(), lat);
        should.equal(demand.getLocation().getLongitude(), lng);
        should.equal(demand.getDistance(), distance);
        should.equal(demand.getPrice().getMin(), min);
        should.equal(demand.getPrice().getMax(), max);
    });
});