var http = require('../client/http'),
    User = require('../models/user'),
    options = require('../client/options');

/*
 * Class: Login
 *
 * This class contains the logic to authenticate a User via neeedo API.
 */
function Login()
{
    this.apiEndpoint = '/users';
    this.onSuccessCallback = undefined;
    this.onErrorCallback = undefined;
}

/*
 * Function: loginUser
 * Triggers user's "login" / authentication action to neeedo api.
 * 
 * - loginModel: see /models/login.js
 * - onSuccessCallback: given function will be called with a given /models/user.js object filled by the API
 * - onErrorCallback: given function will be called with the HTTP response object to trigger error handling
 */
Login.prototype.loginUser = function(loginModel, onSuccessCallback, onErrorCallback)
{
    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;
    
    if (loginModel === null || typeof loginModel !== 'object') {
        throw new Error("Type of loginModel must be object.");
    }
    
    var loginUrlPath = this.apiEndpoint;
    
    // closure
    var _this = this;
    try {
        http.doGet(loginUrlPath,
            function(response) {
                if (200 == response.statusCode) {
                    response.on('data', function (data) {
                        var userData = JSON.parse(data);
                        
                        if (options.isDevelopment()) {
                            console.info("Services\Login::loginUser(): server sent response data " + data);
                        }
                        
                        var loggedInUser = new User().loadFromSerialized(userData['user']);
                        loggedInUser.setAccessToken(loginModel.getAccessToken());

                        _this.onSuccessCallback(loggedInUser);
                    });
                } else {
                    _this.onErrorCallback(response);
                }
            }, 
        {
          authorizationToken: loginModel.getAccessToken()
        });
    } catch (e) {
        onErrorCallback(e);
    }
};

module.exports = Login;
