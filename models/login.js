/*
 * Class: User
 *
 * This class models a Neeedo user.
 */
function Login()
{
    this.email = undefined;
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

module.exports = Login;
