// Dependencies.
const MenuItem = require('../models/MenuItem');

/**
 * Shopping cart class.
 */
class ShoppingCart {
  /**
   * Shopping cart constructor.
   */
  constructor() {
    // By default the cart is empty.
    this.items = [];
    this.total = 0;
  }

  /**
   * @param {object[]} [items]
   * @return {ShoppingCart}
   */
  fromSnapshot({items = []}) {
    // Normalize items.
    this.items = items.map(menuItemData => new MenuItem(menuItemData));
    this.total = this.getTotal();

    return this;
  }

  /**
   * Update shopping cart.
   * @param {MenuItem} menuItem
   * @return {ShoppingCart}
   */
  update(menuItem) {
    // Try to find existing menu item and update it.
    const existingMenuItem = this.items.find(currentMenuItem => currentMenuItem.id === menuItem.id);
    if (existingMenuItem) {
      // Update existing item in the basket.
      existingMenuItem.quantity = menuItem.quantity;
    } else {
      // Add new item to the basket.
      this.items.push(menuItem);
    }

    // Clean up basket.
    this.cleanup();

    // Recalculate basket total sum.
    this.total = this.getTotal();
  }

  /**
   * Clean up basket from the menu items with quantity 0.
   */
  cleanup() {
    this.items = this.items.filter(menuItem => menuItem.quantity);
  }

  /**
   * Get total amount for the basket.
   * @return {number}
   */
  getTotal() {
    let total = 0;

    this.items.forEach((menuItem) => {
      total += menuItem.price * menuItem.quantity;
    });

    return Math.floor(total * 100) / 100;
  }

  /**
   * Get public cart object.
   * @return {object}
   */
  toObject() {
    return {
      items: this.items,
      total: this.total,
    };
  }
}

// Export the module.
module.exports = ShoppingCart;
