/*
 * dependencies
 */
var Demand = require('./demand'),
    _ = require('underscore');

/*
 * Class: DemandQuery
 * 
 * This class is a simple object to keep demand-list query parameters.
 * 
 * It encapsulates parameter names that will be sent to the neeedo API endpoints.
 */
function DemandQuery()
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

DemandQuery.prototype.buildQueryString = function() 
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

DemandQuery.prototype.setOffset = function(offset)
{
    if (_.isNumber(offset)) {
        this.offset = offset;
    }

    return this;
};

DemandQuery.prototype.hasOffset = function()
{
    return undefined !== this.offset;
};

DemandQuery.prototype.getOffset = function()
{
    return this.offset;
};

DemandQuery.prototype.setLimit = function(limit)
{
    if (_.isNumber(limit)) {
        this.limit = limit;
    }

    return this;
};

DemandQuery.prototype.hasLimit = function()
{
    return undefined !== this.limit;
};

DemandQuery.prototype.getLimit = function()
{
    return this.limit;
};

DemandQuery.prototype.setLatitude = function(latitude)
{
    if (_.isNumber(latitude)) {
        this.latitude = latitude;
    }

    return this;
};

DemandQuery.prototype.hasLatitude = function()
{
    return undefined !== this.latitude;
};

DemandQuery.prototype.getLatitude = function()
{
    return this.latitude;
};

DemandQuery.prototype.setLongitude = function(longitude)
{
    if (_.isNumber(longitude)) {
        this.longitude = longitude;
    }

    return this;
};

DemandQuery.prototype.hasLongitude = function()
{
    return undefined !== this.longitude;
};

DemandQuery.prototype.getLongitude = function()
{
    return this.longitude;
};

module.exports = DemandQuery;
