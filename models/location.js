/*
 * Class: Location
 *
 * This class models a Neeedo location.
 */
function Location()
{
    this.latitude = undefined;
    this.longitude = undefined;
}

Location.prototype.setLatitude = function(latitude)
{
    if (latitude !== parseFloat(latitude)) {
        throw new Error("Type of latitude must be float.");
    }

    this.latitude = latitude;
    return this;
};

Location.prototype.getLatitude = function()
{
    return this.latitude;
};

Location.prototype.setLongitude = function(longitude)
{
    if (longitude !== parseFloat(longitude)) {
        throw new Error("Type of longitude must be float.");
    }

    this.longitude = longitude;
    return this;
};

Location.prototype.getLongitude = function()
{
    return this.longitude;
};

/*
 * Function: toApiJson
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Location.prototype.serializeToApi = function() {
    var _this = this;

    return {
        "lat" :      _this.latitude,
        "lon" :      _this.longitude
    };
};

/*
 * Function: loadFromSerialized
 * Load the location by the given serialized one.
 */
Location.prototype.loadFromSerialized = function(serializedLocation) {
    if (serializedLocation === null || typeof serializedLocation !== 'object') {
        throw new Error("Type of serializedLocation must be object.");
    }

    if ("lat" in serializedLocation) {
        this.setLatitude(serializedLocation["lat"]);
    }

    if ("lon" in serializedLocation) {
        this.setLongitude(serializedLocation["lon"]);
    }

    return this;
};

module.exports = Location;