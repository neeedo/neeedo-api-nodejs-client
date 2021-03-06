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
    this.logger = undefined;
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

Options.prototype.setLogger = function(logger) {
    this.logger = logger;
};

Options.prototype.getLogger = function() {
    return this.logger;
};

var options = new Options();
module.exports = options;
