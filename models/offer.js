/*
 * dependencies
 */
var Location = require('./location'),
    User = require('./user'),
    ImageService = require('../services/image')
    ;

var imageService = new ImageService();

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
    this.imageList = imageService.newImageList();
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

Offer.prototype.setImageList = function(imageList)
{
    if (imageList === null || typeof imageList !== 'object') {
        throw new Error("Type of imageList must be object.");
    }

    this.imageList = imageList;
    return this;
};

Offer.prototype.getImages = function()
{
    return this.imageList.getImages();
};

Offer.prototype.getImageList = function()
{
    return this.imageList;
};

/**
 * Function: getQueryStringForApi
 * Get the query string to be appended to the neeedo API endpoint URL in order to perform PUT + DELETE operations.
 */
Offer.prototype.getQueryStringForApi = function()
{
    return "/" + this.getId() + "/" + this.getVersion();
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
       "price" :        _this.getPrice(),
       "images" :       _this.getImageList().serializeForApi()
    };
    
    if (this.hasId()) {
        serializedObj["id"] = this.getId();
    }
    
    return serializedObj;
};

/*
 * Function: loadFromSerialized
 * Load the offer by the given serialized one.
 */
Offer.prototype.loadFromSerialized = function(serializedOffer) {
    if (serializedOffer === null || typeof serializedOffer !== 'object') {
        throw new Error("Type of serializedDemand must be object.");
    }
    
    if ("id" in serializedOffer) {
        this.setId(serializedOffer["id"]);
    }
 
    if ("version" in serializedOffer) {
        this.setVersion(serializedOffer["version"]);
    }

    if ("userId" in serializedOffer) {
        this.getUser().setId(serializedOffer["userId"]);
    }

    if ("user" in serializedOffer) {
        this.setUser(new User().loadFromSerialized(serializedOffer["user"]));
    }

    if ("tags" in serializedOffer) {
        this.setTags(serializedOffer["tags"]);
    }

    if ("location" in serializedOffer) {
        this.setLocation(new Location().loadFromSerialized(serializedOffer["location"]));
    }

    if ("price" in serializedOffer) {
        this.setPrice(serializedOffer["price"]);
    }
    
    if ("images" in serializedOffer) {
        this.setImageList(imageService.newImageList().loadFromSerialized(serializedOffer["images"]));
    }

    if ("imageList" in serializedOffer && "images " in serializedOffer["imageList"]) {
        this.setImageList(imageService.newImageList().loadFromSerialized(serializedOffer["imageList"]["images"]));
    }

    return this;
};

module.exports = Offer;