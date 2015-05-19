/*
 * dependencies
 */
var Offer = require('./offer');

/*
 * Class: DemandList
 * 
 * This class models a Neeedo offer list (multiple offer instances).
 */
function OfferList()
{
    this.demands = undefined;
}

OfferList.prototype.getDemands = function()
{
    return this.demands;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
OfferList.prototype.serializeForApi = function() {
   throw new Error('Not supported');
};

/*
 * Function: loadFromSerialized
 * Load the demand by the given serialized one.
 */
OfferList.prototype.loadFromSerialized = function(serializedOffers) {
    if (serializedOffers === null || typeof serializedOffers !== 'object') {
        throw new Error("Type of serializedDemand must be object.");
    }
    
   this.demands = [];
    
   for (var i=0; i < serializedOffers.length; i++) {
     var serializedOffer = serializedOffers[i];
     this.demands.push(new Offer().loadFromSerialized(serializedOffer));
   }

    return this;
};

module.exports = OfferList;