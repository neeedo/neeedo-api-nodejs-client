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

/*
 * Function: toApiJson
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
User.prototype.serializeToApi = function() {
    var _this = this;

    return {
        "id" :       _this.userId
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

    return this;
};

module.exports = User;