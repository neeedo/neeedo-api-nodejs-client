var http = require('../client/http'),
    user = require('../models/user');

/*
 * Class: User
 *
 * This class realizes the connectivity to register the user.
 */
function Register()
{
    this.apiEndpoint = 'user';
    this.onSuccessCallback = undefined;
    this.onErrorCallback = undefined;
}

/*
 * Function: registerUser
 * Triggers user's registration to neeedo api.
 * 
 * - registrationModel: see /models/register.js
 * - onSuccessCallback: given function will be called with a given /models/user.js object filled by the API
 * - onErrorCallback: given function will be called with the HTTP response object to trigger error handling
 */
Register.prototype.registerUser = function(registrationModel, onSuccessCallback, onErrorCallback)
{
    if (user === null || typeof user !== 'object') {
        throw new Error("Type of user must be object.");
    }
    
    var registerUrlPath = this.apiEndpoint;
    var json = Json.stringify(registrationModel.serializeForApi());

    http.doPost(registerUrlPath, json, this.processRegisterResponse);
};

Register.prototype.processRegisterResponse = function(response)
{
    if (201 == response.statusCode) {
        res.on('data', function (data) {
            var userData = JSON.parse(data);
            var registeredUser = new User().loadFromSerialized(userData);
            
            this.onSuccessCallback(registeredUser);
        });
    } else {
        this.onErrorCallback(response);
    }
};

module.exports = Register;