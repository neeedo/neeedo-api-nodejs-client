/*
 * Class: User
 *
 * This class models a Neeedo user.
 */
function Login()
{
    this.email = undefined;
    this.password = undefined;
}

Login.prototype.setEMail = function(eMail)
{
    if ("string" !== typeof(eMail) ) {
        throw new Error("Type of email must be string.");
    }

    this.email = eMail;
    return this;
};

Login.prototype.getEMail = function()
{
    return this.email;
};

Login.prototype.setPassword = function(password)
{
    if ("string" !== typeof(password) ) {
        throw new Error("Type of email must be string.");
    }

    this.password = password;
    return this;
};

Login.prototype.getPassword = function()
{
    return this.password;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Login.prototype.serializeForApi = function() {
    throw new Error('Not implemented.');
};

/*
 * Function: loadFromSerialized
 * Load the object by the given serialized one.
 */
Login.prototype.loadFromSerialized = function(serializedUser) {
   throw new Error('Not implemented.');
};

/**
 * Function: getQueryStringForApi
 * Get the query string to be appended to the neeedo API endpoint URL in order to perform REST operations.
 */
Login.prototype.getQueryStringForApi = function()
{
    return "/mail/" + this.getEMail();
};

/**
 * Function: getAccessToken
 * @returns {string} the value to be sent in an authentication header.
 */
Login.prototype.getAccessToken = function()
{
    return new Buffer(this.getEMail() + ':' + this.getPassword()).toString('base64');
}

module.exports = Login;
