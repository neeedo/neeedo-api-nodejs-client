/*
 * Class: Image
 *
 * This class models an image that can be loaded from neeedo API images actions: https://github.com/neeedo/neeedo-api#upload-image
  */
function Image(baseUrl)
{
    this.baseUrl = baseUrl;
    this.url = undefined;
    this.fileName = undefined;
    this.user = undefined;
}

/**
 * Get the absolute URL to recieve the image.
 * @returns {*}
 */
Image.prototype.getUrl = function()
{
    return this.getBaseUrl() + this.getQueryStringForApi();
};

Image.prototype.setBaseUrl = function(baseUrl)
{
    if ("string" !== typeof(baseUrl) ) {
        throw new Error("Type of baseUrl must be string.");
    }

    this.baseUrl = baseUrl;
    return this;
};

Image.prototype.getBaseUrl = function()
{
    return this.baseUrl;
};

Image.prototype.setFileName = function(name)
{
    if ("string" !== typeof(name) ) {
        throw new Error("Type of name must be string.");
    }

    this.fileName = name;
    return this;
};

Image.prototype.getFileName = function()
{
    return this.fileName;
};

/**
 * Function: getQueryStringForApi
 * Get the query string to be appended to the neeedo API endpoint URL in order to perform REST operations.
 */
Image.prototype.getQueryStringForApi = function()
{
    return "/" + this.getFileName();
};

Image.prototype.setUser = function(user)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }

    this.user = user;
    return this;
};

Image.prototype.getUser = function()
{
    if (undefined === this.user) {
        this.user = new User();
    }

    return this.user;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Image.prototype.serializeForApi = function() {
    return this.getFileName();
};

/*
 * Function: loadFromSerialized
 * Load the object by the given serialized one.
 */
Image.prototype.loadFromSerialized = function(serializedImage) {
    if ("string" !== typeof(serializedImage)) {
        throw new Error("Type of serializedImage must be string, but was " + (typeof (serializedImage)));
    }
    
    // input is a simple string containing the file name
    this.setFileName(serializedImage);
    
    return this;
};

module.exports = Image;