/*
 * dependencies
 */
var Location = require('./location'),
    User = require('./user'),
    Price = require('./demand/price');

/*
 * Class: Demand
 * 
 * This class models a Neeedo demand.
 */
function Demand()
{
    this.id = undefined;
    this.version = undefined;
    this.user = undefined;
    this.mustTags = undefined;
    this.shouldTags = undefined;
    this.location = undefined;
    this.distance = undefined;
    this.price = undefined;
}

Demand.prototype.setId = function(id)
{
    if ("string" !== typeof(id) ) {
        throw new Error("Type of id must be string.");
    }
    
    this.id = id;
    return this;
};

Demand.prototype.getId = function()
{
    return this.id;
};

Demand.prototype.hasId = function()
{
    return undefined !== this.getId();
};

Demand.prototype.setVersion = function(version)
{
    if (version !== parseInt(version)) {
        throw new Error("Type of version must be integer.");
    }

    this.version = version;
    return this;
};

Demand.prototype.getVersion = function()
{
    return this.version;
};

Demand.prototype.setUser = function(user)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }
    
    this.user = user;
    return this;
};

Demand.prototype.getUser = function()
{
    if (undefined === this.user) {
        this.user = new User();
    }
    
    return this.user;
};

Demand.prototype.setMustTags = function(mustTags)
{
    if (Object.prototype.toString.call( mustTags ) !== '[object Array]') {
        throw new Error("Type of mustTags must be object.");
    }

    this.mustTags = mustTags;
    return this;
};

Demand.prototype.getMustTags = function()
{
    return this.mustTags;
};

Demand.prototype.setShouldTags = function(shouldTags)
{
    if (Object.prototype.toString.call( shouldTags ) !== '[object Array]') {
        throw new Error("Type of shouldTags must be object.");
    }

    this.shouldTags = shouldTags;
    return this;
};

Demand.prototype.getShouldTags = function()
{
    return this.shouldTags;
};

Demand.prototype.setLocation = function(location)
{
    if (location === null || typeof location !== 'object') {
        throw new Error("Type of location must be object.");
    }

    this.location = location;
    return this;
};

Demand.prototype.getLocation = function()
{
    if (undefined === this.location) {
        this.location = new Location();
    }

    return this.location;
};

Demand.prototype.setDistance = function(distance)
{
    if (distance !== parseInt(distance)) {
        throw new Error("Type of distance must be int.");

    }

    this.distance = distance;
    return this;
};

Demand.prototype.getDistance = function()
{
    return this.distance;
};

Demand.prototype.setPrice = function(price)
{
    if (price === null || typeof price !== 'object') {
        throw new Error("Type of price must be object.");
    }

    this.price = price;
    return this;
};

Demand.prototype.getPrice = function()
{
    if (undefined === this.price) {
        this.price = new Price();
    }
    
    return this.price;
};

/**
 * Function: getQueryStringForApi
 * Get the query string to be appended to the neeedo API endpoint URL in order to perform PUT + DELETE operations.
 */
Demand.prototype.getQueryStringForApi = function()
{
    return "/" + this.getId() + "/" + this.getVersion();
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Demand.prototype.serializeForApi = function() {
    var _this = this;
    
    var serializedObj = {
       "userId" :       _this.getUser().getId(),
       "mustTags" :     _this.getMustTags(),
       "shouldTags" :   _this.getShouldTags(),
       "location" :     _this.getLocation().serializeForApi(),
       "distance" :     _this.getDistance(),
       "price" :        _this.getPrice().serializeForApi()
    };
    
    return serializedObj;
};

/*
 * Function: loadFromSerialized
 * Load the demand by the given serialized one.
 */
Demand.prototype.loadFromSerialized = function(serializedDemand) {
    if (serializedDemand === null || typeof serializedDemand !== 'object') {
        throw new Error("Type of serializedDemand must be object.");
    }
    
    if ("id" in serializedDemand) {
        this.setId(serializedDemand["id"]);
    }
 
    if ("version" in serializedDemand) {
        this.setVersion(serializedDemand["version"]);
    }

    if ("userId" in serializedDemand) {
        this.getUser().setId(serializedDemand["userId"]);
    }

    if ("mustTags" in serializedDemand) {
        this.setMustTags(serializedDemand["mustTags"]);
    }

    if ("shouldTags" in serializedDemand) {
        this.setShouldTags(serializedDemand["shouldTags"]);
    }

    if ("location" in serializedDemand) {
        this.setLocation(new Location().loadFromSerialized(serializedDemand["location"]));
    }

    if ("distance" in serializedDemand) {
        this.setDistance(serializedDemand["distance"]);
    }

    if ("price" in serializedDemand) {
        this.setPrice(new Price().loadFromSerialized(serializedDemand["price"]));
    }

    return this;
};

module.exports = Demand;