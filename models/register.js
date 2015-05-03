/*
 * Class: User
 *
 * This class models a Neeedo user.
 */
function Register()
{
    this.username = undefined;
    this.eMail = undefined;
    this.password = undefined;
}

Register.prototype.setUsername = function(username)
{
    if ("string" !== typeof(username) ) {
        throw new Error("Type of username must be string.");
    }

    this.username = username;
    return this;
};

Register.prototype.getUsername = function()
{
    return this.username;
};

Register.prototype.setEMail = function(eMail)
{
    if ("string" !== typeof(eMail) ) {
        throw new Error("Type of eMail must be string.");
    }

    this.eMail = eMail;
    return this;
};

Register.prototype.getEMail = function()
{
    return this.eMail;
};

Register.prototype.setPassword = function(password)
{
    if ("string" !== typeof(password) ) {
        throw new Error("Type of password must be string.");
    }

    this.password = password;
    return this;
};

Register.prototype.getPassword = function()
{
    return this.password;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Register.prototype.serializeForApi = function() {
    var _this = this;

    return {
        "username": _this.getUsername(),
        "email" : _this.getEMail(),
        "password" : _this.getPassword()
    };
};

/*
 * Function: loadFromSerialized
 * Load the object by the given serialized one.
 */
Register.prototype.loadFromSerialized = function(serializedUser) {
   throw new Error('Not implemented.');
};

module.exports = Register;