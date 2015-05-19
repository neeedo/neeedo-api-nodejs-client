var http = require('../client/http'),
    User = require('../models/user'),
    errorHandler = require('../helpers/error-handler'),
    messages = require('../config/messages.json'),
    globalOptions = require('../client/options');

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
    
    // closure
    var _this = this;
    try {
        http.doGet(loginUrlPath,
            function(response) {
                if (200 == response.statusCode) {
                    response.on('data', function (data) {
                        var userData = JSON.parse(data);
                        
                        globalOptions.getLogger().info("Services/Login::loginUser(): server sent response data " + data);
                        
                        var loggedInUser = new User().loadFromSerialized(userData['user']);
                        
                        // store access token in user model
                        loggedInUser.setAccessToken(loginModel.generateAccessToken());

                        onSuccessCallback(loggedInUser);
                    });
                } else {
                    if (404 == response.statusCode || 403 == response.statusCode) {
                        onErrorCallback(errorHandler.newError(messages.login_wrong_credentials));
                    } else {
                        onErrorCallback(errorHandler.newError(response, messages.login_internal_error,
                            { "methodPath" : "Service/Login::loginUser()" }));
                    }
                }
            }, 
        {
          authorizationToken: loginModel.generateAccessToken()
        });
    } catch (e) {
        onErrorCallback(errorHandler.newError(messages.login_internal_error, e.message));
    }
};

module.exports = Login;
