/*
 * Class: User
 *
 * This class models a Neeedo user.
 */
function User()
{
    this.id = undefined;
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

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
User.prototype.serializeForApi = function() {
    var _this = this;

    serializedObj = {};
    if (this.hasId()) {
        serializedObj["id"] = this.getId();
    }

    return serializedObj;
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

    return this;
};

module.exports = User;