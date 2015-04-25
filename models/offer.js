/*
 * dependencies
 */
var Location = require('./location'),
    User = require('./user');

/*
 * Class: Offer
 * 
 * This class models a Neeedo offer.
 */
function Offer()
{
    this.id = undefined;
    this.version = undefined;
    this.user = undefined;
    this.tags = undefined;
    this.location = undefined;
    this.price = undefined;
}

Offer.prototype.setId = function(id)
{
    if ("string" !== typeof(id) ) {
        throw new Error("Type of id must be string.");
    }
    
    this.id = id;
    return this;
};

Offer.prototype.getId = function()
{
    return this.id;
};

Offer.prototype.hasId = function()
{
    return undefined !== this.getId();
};

Offer.prototype.setVersion = function(version)
{
    if (version !== parseInt(version)) {
        throw new Error("Type of version must be integer.");
    }

    this.version = version;
    return this;
};

Offer.prototype.getVersion = function()
{
    return this.version;
};

Offer.prototype.setUser = function(user)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }
    
    this.user = user;
    return this;
};

Offer.prototype.getUser = function()
{
    if (undefined === this.user) {
        this.user = new User();
    }
    
    return this.user;
};

Offer.prototype.setTags = function(tags)
{
    if (Object.prototype.toString.call( tags ) !== '[object Array]') {
        throw new Error("Type of tags must be object.");
    }

    this.tags = tags;
    return this;
};

Offer.prototype.getTags = function()
{
    return this.tags;
};

Offer.prototype.setLocation = function(location)
{
    if (location === null || typeof location !== 'object') {
        throw new Error("Type of location must be object.");
    }

    this.location = location;
    return this;
};

Offer.prototype.getLocation = function()
{
    if (undefined === this.location) {
        this.location = new Location();
    }

    return this.location;
};

Offer.prototype.setPrice = function(price)
{
    if (price !== parseFloat(price)) {
        throw new Error("Type of price must be float.");
    }

    this.price = price;
    return this;
};

Offer.prototype.getPrice = function()
{
    return this.price;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Offer.prototype.serializeForApi = function() {
    var _this = this;
    
    var serializedObj = {
       "userId" :       _this.getUser().getId(),
       "tags" :         _this.getTags(),
       "location" :     _this.getLocation().serializeForApi(),
       "price" :        _this.getPrice()
    };
    
    if (this.hasId()) {
        serializedObj["id"] = this.getId();
    }
    
    return serializedObj;
};

/*
 * Function: loadFromSerialized
 * Load the demand by the given serialized one.
 */
Offer.prototype.loadFromSerialized = function(serializedDemand) {
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

    if ("tags" in serializedDemand) {
        this.setTags(serializedDemand["tags"]);
    }

    if ("location" in serializedDemand) {
        this.setLocation(new Location().loadFromSerialized(serializedDemand["location"]));
    }

    if ("price" in serializedDemand) {
        this.setPrice(serializedDemand["price"]);
    }

    return this;
};

module.exports = Offer;