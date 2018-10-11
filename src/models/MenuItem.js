// Dependencies.
const validator = require('../services/validator');

/**
 * MenuItem class.
 */
class MenuItem {
  /**
   * Menu item constructor.
   * @param {number} id
   * @param {string} name
   * @param {number} price
   * @param {string} image
   * @param {number} quantity
   */
  constructor({id, name, price, image, quantity}) {
    this.id = validator.parsePositiveInteger(id);
    this.name = validator.parseString(name);
    this.price = validator.parsePositiveFloat(price);
    this.image = image;
    this.quantity = quantity;
  }

  /**
   * Convert menu item to public object.
   * @return {object}
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      image: this.image,
      quantity: this.quantity,
    };
  }
}

// Export the module.
module.exports = MenuItem;
