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
        throw new Error("Type of latitude must be float, value was: " + latitude);
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
        throw new Error("Type of longitude must be float, value was: " + longitude);
    }

    this.longitude = longitude;
    return this;
};

Location.prototype.getLongitude = function()
{
    return this.longitude;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Location.prototype.serializeForApi = function() {
    var _this = this;

    return {
        "lat" :      _this.getLatitude(),
        "lon" :      _this.getLongitude()
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

    if ("lat" in serializedLocation
         || "latitude" in serializedLocation) {
        this.setLatitude(serializedLocation["lat"]);
    }

    if ("lon" in serializedLocation
        || "longitude" in serializedLocation) {
        this.setLongitude(serializedLocation["lon"]);
    }

    return this;
};

module.exports = Location;