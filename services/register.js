var http = require('../client/http'),
    User = require('../models/user'),
    errorHandler = require('../helpers/error-handler'),
    ResponseHandler = require('../helpers/response-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder');

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

    try {
        http.doPost(registerUrlPath, json,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        if (201 == response.statusCode) {
                            // data should be the JSON returned by neeedo API, see https://github.com/neeedo/neeedo-api#create-user
                            var userData = JSON.parse(completeData);

                            globalOptions.getLogger().info("Services/Register::registerUser(): server sent response data " + completeData);

                            var registeredUser = new User().loadFromSerialized(userData['user']);

                            onSuccessCallback(registeredUser);
                        } else {
                            errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.register_internal_error,
                                { "methodPath" : "Service/Register::registerUser()",
                                    "requestJson" : json });
                        }
                    },
                    function(error) {
                        errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                            { "methodPath" : "Services/Register::registerUser()" });
                    }
                )
            }, onErrorCallback, {});
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.register_internal_error, e.message);
    }
};

module.exports = Register;