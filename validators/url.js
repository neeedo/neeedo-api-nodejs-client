const URL_REGEX = /(http|https):\/\/[a-zA-Z0-9.:?+=&@!-/]+/;

/**
 * Check whether the given URL is valid by our expected pattern.
 * (http|https):\/\/[a-zA-Z0-9.:?+=&@!-/]+
 *  
 * @param url {String}
 * @returns {boolean}
 */
var isValidUrl = function(url) {
    if ("string" !== typeof(url) ) {
        throw new Error("Parameter url must be of type string");
        
    }
    return URL_REGEX.test(url);
}

module.exports.isValidUrl = isValidUrl;
