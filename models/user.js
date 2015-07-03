/*
 * Class: User
 *
 * This class models a Neeedo user.
 */

var OfferList = require('./offer-list');

function User()
{
    this.id = undefined;
    this.username = undefined;
    this.email = undefined;
    this.accessToken = undefined;
    this.favoriteOffers = undefined;
    
    this.findInFavoriteOffers = function(offerId) {
        for (var i=0; i < this.favoriteOffers.getOffers().length; i++) {
            var offer = this.favoriteOffers.getOffers()[i];
            
            if (offer.getId() == offerId) {
                return true;
            }
        }
        
        return false;
    };
}

User.prototype.setId = function(id)
{
    if ("string" !== typeof(id) ) {
        throw new Error("Type of id must be string.");
    }

    this.id = id;
    return this;
};

User.prototype.getId = function()
{
    return this.id;
};

User.prototype.hasId = function()
{
    return undefined !== this.getId();
};

User.prototype.setVersion = function(version)
{
    if (version !== parseInt(version)) {
        throw new Error("Type of version must be integer.");
    }

    this.version = version;
    return this;
};

User.prototype.getVersion = function()
{
    return this.version;
};

User.prototype.setUsername = function(username)
{
    if ("string" !== typeof(username) ) {
        throw new Error("Type of username must be string.");
    }

    this.username = username;
    return this;
};

User.prototype.getUsername = function()
{
    return this.username;
};

User.prototype.setEMail = function(eMail)
{
    if ("string" !== typeof(eMail) ) {
        throw new Error("Type of email must be string.");
    }

    this.email = eMail;
    return this;
};

User.prototype.getEMail = function()
{
    return this.email;
};

/**
 * Set the access token to be sent in the Authorization header to API.
 * @param accessToken
 * @returns {User}
 */
User.prototype.setAccessToken = function(accessToken)
{
    if ("string" !== typeof(accessToken) ) {
        throw new Error("Type of accessToken must be string.");
    }

    this.accessToken = accessToken;
    return this;
};

User.prototype.getAccessToken = function()
{
    return this.accessToken;
};

/**
 * Set user's favorite offers list.
 * @param favoriteOfferList see models/offer-list.js
 * @returns {User}
 */
User.prototype.setFavoriteOfferList = function(favoriteOfferList)
{
    if (!_.isObject(favoriteOfferList)) {
        throw new Error("Type of favoriteOfferList must be object.");
    }

    this.favoriteOffers = favoriteOfferList;
    return this;
};

User.prototype.getFavoriteOfferList = function()
{
    return this.favoriteOffers;
};

User.prototype.isFavoriteOffer = function(offer)
{
    return undefined !== this.getFavoriteOfferList() && this.findInFavoriteOffers(offer.getId());
};

User.prototype.hasAccessToken = function()
{
    return undefined !== this.getAccessToken();
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
User.prototype.serializeForApi = function() {
    var _this = this;

    serializedObj = {
        "name" : _this.getUsername(),
        "email" : _this.getEMail()
    };

    return serializedObj;
};

User.prototype.serializeForMatching = function() {
  return {
        "id" : this.getId(),
        "name" : this.getUsername()
  };
};
/*
 * Function: loadFromSerialized
 * Load the object by the given serialized one.
 */
User.prototype.loadFromSerialized = function(serializedUser) {
    if (serializedUser === null || typeof serializedUser !== 'object') {
        throw new Error("Type of serializedUser must be object.");
    }

    if ("id" in serializedUser
        && undefined !== serializedUser['id']) {
        this.setId(serializedUser["id"]);
    }
    
    if ("version" in serializedUser
        && undefined !== serializedUser['version']) {
        this.setVersion(serializedUser["version"]);
    }
    
    if ("username" in serializedUser
        && undefined !== serializedUser['username']) {
        this.setUsername(serializedUser["username"]);
    }
    
    if ("name" in serializedUser
        && undefined !== serializedUser['name']) {
        this.setUsername(serializedUser["name"]);
    }

    if ("email" in serializedUser
        && undefined !== serializedUser['email']) {
        this.setEMail(serializedUser["email"]);
    }
    
    if ("accessToken" in serializedUser
        && undefined !== serializedUser['accessToken']) {
        this.setAccessToken(serializedUser['accessToken']);
    }

    if ("favoriteOffers" in serializedUser
        && undefined !== serializedUser['favoriteOffers']) {
        this.setFavoriteOfferList(new OfferList().loadFromSerialized(serializedUser['favoriteOffers']));
    }

    return this;
};

module.exports = User;