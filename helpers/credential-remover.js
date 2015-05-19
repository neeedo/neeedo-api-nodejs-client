/*
 * Class: CredentialRemover
 *
 * This class removes sensitive information from string inputs (e.g. passwords) so that they can be logged better.
 */
function CredentialRemover()
{
    this.starifyStr = '*******';
}

CredentialRemover.prototype.removeCredential = function(inputStr) {
    if ("string" !== typeof(inputStr) ) {
        throw new Error("Type of inputStr must be string.");
    }
    
    return this.removePassword(inputStr);
};

CredentialRemover.prototype.removePassword = function(inputStr) {
    return inputStr.replace(/"password":".*?"/i, '"password":"*******"');
};

CredentialRemover.prototype.getStarifyStr = function () {
  return this.starifyStr;
};

var credentialRemover = new CredentialRemover();
module.exports = credentialRemover;
