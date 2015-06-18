/**
 * OptionBuilder to simplify building of options object that is handed to the http adapter (client/http.js).
 *
 * @constructor
 */
function OptionBuilder() {
  this.options = {};
};

OptionBuilder.prototype.addAuthorizationToken = function(user) {
   if (undefined !== user) {
       this.options['authorizationToken'] = user.getAccessToken();
   }

   return this;
};

OptionBuilder.prototype.add = function (property, value) {
  this.options[property] = value;
    
  return this;
}

OptionBuilder.prototype.getOptions = function() {
    return this.options;
};

module.exports = OptionBuilder;
