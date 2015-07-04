var http = require('../client/http'),
    ImageModel = require('../models/image'),
    ImageListModel = require('../models/image-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder');

/*
 * Class: Image
 *
 * This class contains the logic to work with Neeedo images (delete operation).
 */
function Image()
{
    this.apiEndpoint = '/images';
}

Image.prototype.getBaseUrl = function() {
    return globalOptions.getApiUrl() + this.apiEndpoint;
};

Image.prototype.newImage = function() {
    return new ImageModel(this.getBaseUrl());
};


Image.prototype.newImageList = function() {
    return new ImageListModel(this.getBaseUrl());
};

/*
 * Function: uploadImage
 * Triggers the upload of an image.
 *
 * - imageName: file name
 * - imagePath: absolute path to the image file to be uploaded - make sure that it exists on the server!
 * - onSuccessCallback: given function will be called with /models/image.js instance on success
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Image.prototype.uploadImage = function(imageName, imagePath, mimeType, user, onSuccessCallback, onErrorCallback)
{
    if ("string" !== typeof(imagePath) ) {
        throw new Error("Type of imagePath must be string.");
    }

    var uploadImageUrl = this.apiEndpoint;

    var _this = this;
    try {
        http.sendFile(uploadImageUrl,
            imageName,
            imagePath,
            mimeType,
            function(response, completeData) {
                globalOptions.getLogger().info("Services/Image::uploadImage(): server sent response data " + completeData);
                
                if (201 == response.statusCode) {
                    var imageData = JSON.parse(completeData);
                    var imageModel = _this.newImage().loadFromSerialized(imageData['image']);

                    onSuccessCallback(imageModel);
                } else {
                    errorHandler.newMessageAndLogError(onErrorCallback, messages.upload_image_internal_error, 
                        'Got response: ' + response.statusCode + " " + response.statusMessage + " - data "+ completeData);
                }

            },
            onErrorCallback,
            new OptionBuilder().addAuthorizationToken(user).add('fieldName', 'image').getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.upload_image_internal_error, e.message);
    }
};

module.exports = Image;
