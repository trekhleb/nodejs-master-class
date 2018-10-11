// Dependencies.
const createRandomString = require('../services/randomString');

// The length of the order id.
const orderIdLength = 20;

/**
 * Order class
 */
class Order {
  constructor() {
    // List of menu items user is going to by
    this.id = createRandomString(orderIdLength);
    this.items = [];
    this.amount = 0;
    this.currency = 'usd';
    this.paymentSource = '';
    this.status = 'new';
    this.email = '';
    this.date = Date.now();
  }

  /**
   * Check if order has all required fields.
   * @return {boolean}
   */
  isValid() {
    return this.id
      && this.amount
      && this.status
      && this.currency
      && this.paymentSource
      && this.items
      && this.email
      && this.date
      && this.items.length;
  }

  /**
   * Restore order object from database snapshot.
   * @param {string} id
   * @param {object[]} items
   * @param {number} amount
   * @param {string} paymentSource
   * @param {string} currency
   * @param {string} status
   * @param {string} email
   * @param {number} date
   * @return {Order}
   */
  fromSnapshot({id, items, amount, paymentSource, currency, status, email, date}) {
    this.id = id;
    this.items = items;
    this.amount = amount;
    this.paymentSource = paymentSource;
    this.currency = currency;
    this.status = status;
    this.email = email;
    this.date = date;

    return this;
  }
}

// Export the module.
module.exports = Order;
