/*
 * Class: User
 *
 * This class models a Neeedo user.
 */
function User()
{
    this.id = undefined;
    this.username = undefined;
    this.email = undefined;
    this.accessToken = undefined;
}

User.prototype.setId = function(id)
{
    if ("string" !== typeof(id) ) {
        throw new Error("Type of id must be string.");
    }

    this.id = id;
    return this;
};

User.prototype.getId = function()
{
    return this.id;
};

User.prototype.hasId = function()
{
    return undefined !== this.getId();
};

User.prototype.setVersion = function(version)
{
    if (version !== parseInt(version)) {
        throw new Error("Type of version must be integer.");
    }

    this.version = version;
    return this;
};

User.prototype.getVersion = function()
{
    return this.version;
};

User.prototype.setUsername = function(username)
{
    if ("string" !== typeof(username) ) {
        throw new Error("Type of username must be string.");
    }

    this.username = username;
    return this;
};

User.prototype.getUsername = function()
{
    return this.username;
};

User.prototype.setEMail = function(eMail)
{
    if ("string" !== typeof(eMail) ) {
        throw new Error("Type of email must be string.");
    }

    this.email = eMail;
    return this;
};

User.prototype.getEMail = function()
{
    return this.email;
};

/**
 * Set the access token to be sent in the Authorization header to API.
 * @param accessToken
 * @returns {User}
 */
User.prototype.setAccessToken = function(accessToken)
{
    if ("string" !== typeof(accessToken) ) {
        throw new Error("Type of accessToken must be string.");
    }

    this.accessToken = accessToken;
    return this;
};

User.prototype.getAccessToken = function()
{
    return this.accessToken;
};

User.prototype.hasAccessToken = function()
{
    return undefined !== this.getAccessToken();
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
User.prototype.serializeForApi = function() {
    var _this = this;

    serializedObj = {
        "name" : _this.getUsername(),
        "email" : _this.getEMail()
    };

    return serializedObj;
};

User.prototype.serializeForMatching = function() {
  return {
        "id" : this.getId(),
        "name" : this.getUsername()
  };
};
/*
 * Function: loadFromSerialized
 * Load the object by the given serialized one.
 */
User.prototype.loadFromSerialized = function(serializedUser) {
    if (serializedUser === null || typeof serializedUser !== 'object') {
        throw new Error("Type of serializedUser must be object.");
    }

    if ("id" in serializedUser) {
        this.setId(serializedUser["id"]);
    }
    
    if ("version" in serializedUser) {
        this.setVersion(serializedUser["version"]);
    }
    
    if ("username" in serializedUser) {
        this.setUsername(serializedUser["username"]);
    }
    
    if ("name" in serializedUser) {
        this.setUsername(serializedUser["name"]);
    }

    if ("email" in serializedUser) {
        this.setEMail(serializedUser["email"]);
    }
    
    if ("accessToken" in serializedUser) {
        this.setAccessToken(serializedUser['accessToken']);
    }

    return this;
};

module.exports = User;