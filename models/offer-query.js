/*
 * dependencies
 */
var Demand = require('./demand'),
    _ = require('underscore');

/*
 * Class: OfferQuery
 * 
 * This class is a simple object to keep offer-list query parameters.
 * 
 * It encapsulates parameter names that will be sent to the neeedo API endpoints.
 */
function OfferQuery()
{
    this.offsetParameterName = 'offset';
    this.limitParameterName = 'limit';

    this.latitudeParameterName = 'lat';
    this.longitudeParameterName = 'lon';
    
    this.offset = undefined;
    this.limit = undefined;
    this.latitude = undefined;
    this.longitude = undefined;
}

OfferQuery.prototype.buildQueryString = function()
{
    var parameters = [];
    
    if (this.hasOffset()) {
        parameters.push(this.offsetParameterName + '=' + this.getOffset());
    }
    
    if (this.hasLimit()) {
        parameters.push(this.limitParameterName + '=' + this.getLimit());
    }

    if (this.hasLatitude()) {
        parameters.push(this.latitudeParameterName + '=' + this.getLatitude());
    }

    if (this.hasLongitude()) {
        parameters.push(this.longitudeParameterName + '=' + this.getLongitude());
    }

    return "?" + parameters.join("&");
};

OfferQuery.prototype.setOffset = function(offset)
{
   if (_.isNumber(offset)) {
      this.offset = offset;
   }  
    
   return this;
};

OfferQuery.prototype.hasOffset = function()
{
    return undefined !== this.offset;
};

OfferQuery.prototype.getOffset = function()
{
    return this.offset;
};

OfferQuery.prototype.setLimit = function(limit)
{
    if (_.isNumber(limit)) {
        this.limit = limit;
    }

    return this;
};

OfferQuery.prototype.hasLimit = function()
{
    return undefined !== this.limit;
};

OfferQuery.prototype.getLimit = function()
{
    return this.limit;
};

OfferQuery.prototype.setLatitude = function(latitude)
{
    if (_.isNumber(latitude)) {
        this.latitude = latitude;
    }

    return this;
};

OfferQuery.prototype.hasLatitude = function()
{
    return undefined !== this.latitude;
};

OfferQuery.prototype.getLatitude = function()
{
    return this.latitude;
};

OfferQuery.prototype.setLongitude = function(longitude)
{
    if (_.isNumber(longitude)) {
        this.longitude = longitude;
    }

    return this;
};

OfferQuery.prototype.hasLongitude = function()
{
    return undefined !== this.longitude;
};

OfferQuery.prototype.getLongitude = function()
{
    return this.longitude;
};

module.exports = OfferQuery;
