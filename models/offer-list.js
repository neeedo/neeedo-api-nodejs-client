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
    this.offers = [];
}

OfferList.prototype.getOffers = function()
{
    return this.offers;
};

OfferList.prototype.addOffer = function(offer)
{
    this.offers.push(offer);
    
    return this;
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
    
   this.offers = [];
    
   for (var i=0; i < serializedOffers.length; i++) {
     var serializedOffer = serializedOffers[i];
     this.addOffer(new Offer().loadFromSerialized(serializedOffer));
   }

   return this;
};

module.exports = OfferList;