/*
 * dependencies
 */
var OfferQuery    = require('../../models/offer-query.js'),
    should    = require('should');

describe('#OfferQuery', function() {
    it("builds expected query string if all query parameters are given", function() {
        var offerQuery = new OfferQuery();
        offerQuery
            .setLatitude(55.5123)
            .setLongitude(10.1234)
            .setLimit(10)
            .setOffset(1);

        should.equal('?offset=1&limit=10&latitude=55.5123&longitude=10.1234', offerQuery.buildQueryString());
    });
    
    it("builds expected query string for partly criteria", function() {
        var offerQuery = new OfferQuery();
        offerQuery
            .setLimit(10)
            .setOffset(1);

        should.equal('?offset=1&limit=10', offerQuery.buildQueryString());
    });
});