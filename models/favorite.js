/*
 * dependencies
 */
var User = require('./user'),
    Offer = require('./offer'),
    _ = require('underscore');

/*
 * Class: Favorite
 * 
 * This class models a Neeedo favorite entry.
 */
function Favorite()
{
    this.user = undefined;
    this.offer = undefined;
}

Favorite.prototype.setUser = function(user)
{
    if (!_.isObject(user)) {
        throw new Error("Type of user must be object.");
    }
    
    this.user = user;
    return this;
};

Favorite.prototype.getUser = function()
{
    if (undefined === this.user) {
        this.user = new User();
    }
    
    return this.user;
};

Favorite.prototype.setOffer = function(offer)
{
    if (!_.isObject(offer)) {
        throw new Error("Type of offer must be object.");
    }

    this.offer = offer;
    return this;
};

Favorite.prototype.getOffer = function()
{
    if (undefined === this.offer) {
        this.offer = new Offer();
    }

    return this.offer;
};

/**
 * Function: getQueryStringForApi
 * Get the query string to be appended to the neeedo API endpoint URL in order to perform REST operations.
 */
Favorite.prototype.getQueryStringForApi = function()
{
    throw new Error("This method is not supported.");
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API (POST + PUT).
 */
Favorite.prototype.serializeForApi = function() {
    var _this = this;

    var serializedObj = {
       "userId" :     _this.getUser().getId(),
       "offerId" :     _this.getOffer().getId()
    };
    
    return serializedObj;
};
/*
 * Function: loadFromSerialized
 * Load the favorite by the given serialized one - this method is not supported (favorites are loaded via offer-list service).
 */
Favorite.prototype.loadFromSerialized = function(serializedMessage) {
    throw new Error("This method is not supported.");
};

module.exports = Favorite;
