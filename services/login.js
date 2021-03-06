var http = require('../client/http'),
    User = require('../models/user'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    ResponseHandler = require('../helpers/response-handler'),
    globalOptions = require('../client/options'),
    OptionBuilder = require('../helpers/option-builder');

/*
 * Class: Login
 *
 * This class contains the logic to authenticate a User via neeedo API.
 */
function Login()
{
    this.apiEndpoint = '/users';
}

/*
 * Function: loginUser
 * Triggers user's "login" / authentication action to neeedo api.
 * 
 * - loginModel: see /models/login.js
 * - onSuccessCallback: given function will be called with a given /models/user.js object filled by the API
 * - onErrorCallback: given function will be called with the /models/error.js instance
 */
Login.prototype.loginUser = function(loginModel, onSuccessCallback, onErrorCallback)
{
    if (loginModel === null || typeof loginModel !== 'object') {
        throw new Error("Type of loginModel must be object.");
    }
    
    var loginUrlPath = this.apiEndpoint + loginModel.getQueryStringForApi();

    try {
        http.doGet(loginUrlPath,
            function(response) {
                var responseHandler = new ResponseHandler();

                responseHandler.handle(
                    response,
                    function(completeData) {
                        if (200 == response.statusCode) {
                            var userData = JSON.parse(completeData);

                            var loggedInUser = new User().loadFromSerialized(userData['user']);

                            // store access token in user model
                            loggedInUser.setAccessToken(loginModel.generateAccessToken());

                            onSuccessCallback(loggedInUser);
                        } else {
                            if (404 == response.statusCode || 403 == response.statusCode) {
                                errorHandler.newMessageError(onErrorCallback, messages.login_wrong_credentials);
                            } else {
                                errorHandler.newErrorWithData(onErrorCallback, response, completeData, messages.login_internal_error,
                                    { "methodPath" : "Service/Login::loginUser()" });
                            }
                        }
                    },
                    function(error) {
                            errorHandler.newErrorWithData(onErrorCallback, response, error, messages.no_api_connection,
                                { "methodPath" : "Services/Login::loginUser()" });
                    }
                )
            },
            onErrorCallback,
            new OptionBuilder().add('authorizationToken', loginModel.generateAccessToken()).getOptions());
    } catch (e) {
        errorHandler.newMessageAndLogError(onErrorCallback, messages.login_internal_error, e.message);
    }
};

module.exports = Login;
