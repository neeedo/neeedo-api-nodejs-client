/*
 * dependencies
 */
var DemandQuery    = require('../../models/demand-query.js'),
    should    = require('should');

describe('#DemandQuery', function() {
    it("builds expected query string if all query parameters are given", function() {
        var demandQuery = new DemandQuery();
        demandQuery
            .setLatitude(55.5123)
            .setLongitude(10.1234)
            .setLimit(10)
            .setOffset(1);

        should.equal('?offset=1&limit=10&latitude=55.5123&longitude=10.1234', demandQuery.buildQueryString());
    });
    
    it("builds expected query string for partly criteria", function() {
        var demandQuery = new DemandQuery();
        demandQuery
            .setLimit(10)
            .setOffset(1);

        should.equal('?offset=1&limit=10', demandQuery.buildQueryString());
    });
});