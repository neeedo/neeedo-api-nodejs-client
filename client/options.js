/*
 * dependencies
 */
var validUrl = require('../validators/url');

/*
 * class constructor
 */
function Options()
{
    this.neeedoApiUrl = undefined;
    this.allowSelfSignedCertificates = undefined;
    this.isDebug = undefined;
}

Options.prototype.getApiUrl = function () {
    return this.neeedoApiUrl;
}

Options.prototype.setApiUrl = function(url) {
    if (!validUrl.isValidUrl(url)) {
        throw "Attempt to set an invalid Neeedo API URL. Given value: " + url;
    }
    
    this.neeedoApiUrl = url;
}

Options.prototype.isAllowSelfSignedCertificates = function () {
    if (true == this.allowSelfSignedCertificates) {
        return true;
    }
    
    return false;
}

Options.prototype.setAllowSelfSignedCertificates = function(allow) {
    this.allowSelfSignedCertificates = allow;
}

Options.prototype.isDevelopment = function () {
    if ("development" == process.env.NODE_ENV) {
        return true;        
    }
    
    return false;
}

Options.prototype.setDebug = function(isDebug) {
    this.isDebug = isDebug;
};

Options.prototype.isDebugMode = function() {
    return this.isDevelopment() && this.isDebug;
};

var options = new Options();
module.exports = options;
