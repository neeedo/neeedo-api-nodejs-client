var AssociatedEntityValidator = require('../validators/external-image/associated-entity');

/*
 * Class: User
 *
 * This class models an external image that can be added to an offer / demand.
  */
function ExternalImage()
{
    this.associatedEntity = undefined;
    
    this.url = undefined;
    this.width = undefined;
    this.height = undefined;
}

ExternalImage.prototype.setUrl = function(url)
{
    if ("string" !== typeof(url) ) {
        throw new Error("Type of url must be string.");
    }

    this.url = url;
    return this;
};

ExternalImage.prototype.getUrl = function()
{
    return this.url;
};

ExternalImage.prototype.setWidth = function(width)
{
    if ("string" !== typeof(width) ) {
        throw new Error("Type of width must be string.");
    }

    this.width = width;
    return this;
};

ExternalImage.prototype.getWidth = function()
{
    return this.width;
};

ExternalImage.prototype.setHeight = function(height)
{
    if ("string" !== typeof(height) ) {
        throw new Error("Type of height must be string.");
    }

    this.height = height;
    return this;
};

ExternalImage.prototype.getHeight = function()
{
    return this.height;
};

/**
 * Set the entity (e.g. demand or offer) that this external image is associated to.
 *
 * @param associatedEntity
 * @returns {Offer}
 * @throws Error
 */
ExternalImage.prototype.setAssociatedEntity = function(associatedEntity)
{
    var validator = new AssociatedEntityValidator();
    
    if (!validator.isValid(associatedEntity)) {
        throw new Error(validator.getError());
    }

    this.associatedEntity = associatedEntity;
    return this;
};

ExternalImage.prototype.getAssociatedEntity = function()
{
    return this.associatedEntity;
};

/**
 * Function: getQueryStringForApi
 * Get the query string to be appended to the neeedo API endpoint URL in order to perform REST operations.
 */
ExternalImage.prototype.getQueryStringForApi = function()
{
    if (undefined === this.getAssociatedEntity()) {
        throw new Error('ExternalImage::getQueryStringForApi(): you need to set an associated entity (e.g. demand or offer)' +
        ' before you can perform a CRUD operation.');
    }
    
    return "/images/" + this.getAssociatedEntity().getId();
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
ExternalImage.prototype.serializeForApi = function() {
    var _this = this;

    serializedObj = {
        "url" : _this.getUrl(),
        "width" : _this.getWidth(),
        "height" : _this.getHeight()
    };

    return serializedObj;
};

/*
 * Function: loadFromSerialized
 * Load the object by the given serialized one.
 */
ExternalImage.prototype.loadFromSerialized = function(serializedImage) {
    throw new Error('Not implemented');
};

module.exports = ExternalImage;