var http = require('../client/http'),
    User = require('../models/user'),
    globalOptions = require('../client/options');

/*
 * Class: Register
 *
 * This class realizes the connectivity to register the user.
 */
function Register()
{
    this.apiEndpoint = '/users';
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
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;
    
    if (registrationModel === null || typeof registrationModel !== 'object') {
        throw new Error("Type of registrationModel must be object.");
    }
    
    var registerUrlPath = this.apiEndpoint;
    var json = JSON.stringify(registrationModel.serializeForApi());
    
    // closure
    var _this = this;
    try {
        http.doPost(registerUrlPath, json,
            function(response) {
                if (201 == response.statusCode) {
                    response.on('data', function (data) {
                        // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-user
                        var userData = JSON.parse(data);
                        
                        if (globalOptions.isDevelopment()) {
                            console.info("Services/Register::registerUser(): server sent response data " + data);
                        }
                        
                        var registeredUser = new User().loadFromSerialized(userData['user']);

                        _this.onSuccessCallback(registeredUser);
                    });
                } else {
                    _this.onErrorCallback(response);
                }
            }, {});
    } catch (e) {
        onErrorCallback(e);
    }
};

module.exports = Register;