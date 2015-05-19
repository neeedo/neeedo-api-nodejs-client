var http = require('../client/http'),
    User = require('../models/user'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

/*
 * Class: Register
 *
 * This class realizes the connectivity to register the user.
 */
function Register()
{
    this.apiEndpoint = '/users';
}

/*
 * Function: registerUser
 * Triggers user's registration to neeedo api.
 * 
 * - registrationModel: see /models/register.js
 * - onSuccessCallback: given function will be called with a given /models/user.js object filled by the API
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Register.prototype.registerUser = function(registrationModel, onSuccessCallback, onErrorCallback)
{
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

                        globalOptions.getLogger().info("Services/Register::registerUser(): server sent response data " + data);
                        
                        var registeredUser = new User().loadFromSerialized(userData['user']);

                        onSuccessCallback(registeredUser);
                    });
                } else {
                        onErrorCallback(errorHandler.newError(response, messages.register_internal_error,
                            { "methodPath" : "Service/Register::registerUser()",
                              "requestJson" : json }));
                }
            }, {});
    } catch (e) {
        onErrorCallback(errorHandler.newMessageAndLogError(messages.register_internal_error, e.message));
    }
};

module.exports = Register;