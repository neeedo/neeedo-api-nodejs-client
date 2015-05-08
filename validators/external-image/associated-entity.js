var Demand = require('../../models/demand.js'),
    Offer = require('../../models/offer.js');

var AssociatedEntity = function()
{
    this.error = undefined;
};

/**
 * Check whether a correct value is given for associatedEntity.
 *
 * @param associatedEntity {String}
 * @returns {boolean}
 */
AssociatedEntity.prototype.isValid = function(associatedEntity) {
    if (associatedEntity === null || typeof associatedEntity !== 'object') {
        this.error = 'AssociatedEntity is not an object.';
        return false;
    }
    
    if (!Demand.isPrototypeOf(associatedEntity)
    || !Offer.isPrototypeOf(associatedEntity)) {
        this.error = 'AssociatedEntity is not a Demand or Offer.';
        return false;
    }
    
    return true;
};

AssociatedEntity.prototype.getError = function() {
    return this.error;
};

module.exports = AssociatedEntity;
