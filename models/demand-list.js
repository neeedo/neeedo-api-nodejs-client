/*
 * dependencies
 */
var Demand = require('./demand');

/*
 * Class: DemandList
 * 
 * This class models a Neeedo offer list (multiple offer instances).
 */
function DemandList()
{
    this.demands = undefined;
}

DemandList.prototype.getDemands = function()
{
    return this.demands;
};

/*
 * Function: serializeForApi
 * Returns the serialized simple javascript object that can be send to the neeedo API.
 */
DemandList.prototype.serializeForApi = function() {
   throw new Error('Not supported');
};

/*
 * Function: loadFromSerialized
 * Load the demand by the given serialized one.
 */
DemandList.prototype.loadFromSerialized = function(serializedDemands) {
    if (serializedDemands === null || typeof serializedDemands !== 'object') {
        throw new Error("Type of serializedDemands must be object.");
    }
    
   this.demands = [];
    
   for (var i=0; i < serializedDemands.length; i++) {
     var serializedDemand = serializedDemands[i];
     this.demands.push(new Demand().loadFromSerialized(serializedDemand));
   }

    return this;
};

module.exports = DemandList;