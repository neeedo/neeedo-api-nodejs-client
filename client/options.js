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

var options = new Options();
module.exports = options;
