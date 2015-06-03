var http = require('../client/http'),
    ImageModel = require('../models/image'),
    ImageListModel = require('../models/image-list'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

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

    globalOptions.getLogger().info('Sending ' + imageName + '...');

    var uploadImageUrl = this.apiEndpoint;

    var _this = this;
    try {
        http.sendFile(uploadImageUrl,
            imageName,
            imagePath,
            mimeType,
            function(response) {
                var completeData = '';

                response.on('data', function(chunk) {
                    completeData += chunk;
                });

                response.on('end', function () {
                    // success on 200 = OK
                    if (200 == response.statusCode) {
                        var imageData = JSON.parse(completeData);

                        var imageModel = _this.newImage().loadFromSerialized(imageData['image']);

                        onSuccessCallback(imageModel);
                    } else {
                        //errorHandler.newMessageAndLogError(onErrorCallback, 'Pech gehabt', 'Got response: ' + util.inspect(completeData));
                        errorHandler.newErrorWithData(onErrorCallback, response, completeData, 'pech',
                            {"methodPath": "Service/Image::uploadImage()"});
                    }
                });

                response.on('error', function(error) {
                    errorHandler.newError(onErrorCallback, response, messages.no_api_connection,
                        { "methodPath" : "Services/Offer::load()" });
                });
            },
            onErrorCallback,
            {
                authorizationToken: user.getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.upload_image_internal_error, e.message);
    }
};

/*
 * Function: deleteImage
 * Triggers the deletion of an image.
 *
 * - imageModel: see /models/image.js
 * - onSuccessCallback: given function will be called with the originally given imageModel on success
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Image.prototype.deleteImage = function(imageModel, onSuccessCallback, onErrorCallback)
{
    if (imageModel === null || typeof imageModel !== 'object') {
        throw new Error("Type of imageModel must be object.");
    }

    var deleteImagePath = imageModel.getUrl();

    try {
        http.doDelete(deleteImagePath,
            function(response) {
                // success on 200 = OK
                if (200 == response.statusCode) {
                    onSuccessCallback(imageModel);
                } else {
                    if (404 == response.statusCode) {
                        errorHandler.newMessageError(onErrorCallback, messages.image_not_found);
                    } else if (401 == response.statusCode) {
                        errorHandler.newMessageError(onErrorCallback, messages.image_wrong_credentials);
                    } else {
                        errorHandler.newError(onErrorCallback, response, messages.delete_image_internal_error,
                            { "methodPath" : "Service/Image::deleteImage()" });
                    }
                }
            },
            onErrorCallback,
            {
                authorizationToken: imageModel.getUser().getAccessToken()
            });
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.delete_image_internal_error, e.message);
    }
};

module.exports = Image;
