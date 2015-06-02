/*
 * dependencies
 */
var Image = require('./image'), util = require('util');

/*
 * Class: ImageList
 * 
 * This class models a Neeedo image list (multiple image instances).
 */
function ImageList(baseUrl)
{
    this.baseUrl = baseUrl;
    this.images = [];
}

ImageList.prototype.getImages = function()
{
    return this.images;
};

ImageList.prototype.addImage = function(image)
{
    this.images.push(image);

    return this;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
ImageList.prototype.serializeForApi = function() {
    var imagePathes = [];
    
    for (var i = 0; i < this.images.length; i++) {
        imagePathes.push(this.images[i].serializeForApi());
    }
    
    return imagePathes;
};

/*
 * Function: loadFromSerialized
 * Load the image list by the given serialized one.
 */
ImageList.prototype.loadFromSerialized = function(serializedImages) {
    if (serializedImages === null || typeof serializedImages !== 'object') {
        throw new Error("Type of serializedImages must be object.");
    }
    
   this.images = [];
    
   for (var i=0; i < serializedImages.length; i++) {
     var serializedImage = serializedImages[i];
     this.addImage(new Image(this.baseUrl).loadFromSerialized(serializedImage));
   }

    return this;
};

module.exports = ImageList;