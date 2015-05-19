/*
 * dependencies
 */
var DemandList    = require('../../models/demand-list.js'),
    should    = require('should');

describe('#DemandList', function() {
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

        var incomingJson = [neeedoDemandJson, neeedoDemandJson];
      
        // when loadFromSerialized is called
        var demandList = new DemandList();
        demandList.loadFromSerialized(incomingJson);

        // then the object should be loaded correctly...
        demandList.should.be.a.Object;
        should.equal(demandList.getDemands().length, 2);
        
        var firstDemand = demandList.getDemands()[0];

        should.equal(firstDemand.getId(), demandId);
        should.equal(firstDemand.getVersion(), version);
        should.equal(firstDemand.getUser().getId(), userId);
        should.equal(firstDemand.getMustTags(), mustTags);
        should.equal(firstDemand.getShouldTags(), shouldTags);
        should.equal(firstDemand.getLocation().getLatitude(), lat);
        should.equal(firstDemand.getLocation().getLongitude(), lng);
        should.equal(firstDemand.getDistance(), distance);
        should.equal(firstDemand.getPrice().getMin(), min);
        should.equal(firstDemand.getPrice().getMax(), max);
    });
});