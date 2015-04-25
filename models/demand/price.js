/*
 * Class: Price
 *
 * This class models a Neeedo price.
 */
function Price()
{
    this.min = undefined;
    this.max = undefined;
}

Price.prototype.setMin = function(min)
{
    if (min !== parseFloat(min)) {
        throw new Error("Type of latitude must be float.");
    }

    this.min = min;
    return this;
};

Price.prototype.getMin = function()
{
    return this.min;
};

Price.prototype.setMax = function(max)
{
    if (max !== parseFloat(max)) {
        throw new Error("Type of max must be float.");
    }

    this.max = max;
    return this;
};

Price.prototype.getMax = function()
{
    return this.max;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
Price.prototype.serializeForApi = function() {
    var _this = this;

    return {
        "min" :      _this.getMin(),
        "max" :      _this.getMax()
    };
};

/*
 * Function: loadFromSerialized
 * Load the price by the given serialized one.
 */
Price.prototype.loadFromSerialized = function(serializedPrice) {
    if (serializedPrice === null || typeof serializedPrice !== 'object') {
        throw new Error("Type of serializedPrice must be object.");
    }

    if ("min" in serializedPrice) {
        this.setMin(serializedPrice["min"]);
    }

    if ("max" in serializedPrice) {
        this.setMax(serializedPrice["max"]);
    }

    return this;
};

module.exports = Price;