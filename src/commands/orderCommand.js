// Dependencies.
const cliHelper = require('../services/cliHelper');
const database = require('../services/database');

/**
 * Execute "Order" command.
 * @param {string} inputString
 */
const orderCommand = (inputString) => {
  // Get the id from the string.
  const params = inputString.split('--');
  const orderId = typeof params[1] === 'string' && params[1].trim().length > 0 ? params[1].trim() : false;
  if (orderId) {
    // Load the order.
    database.read('orders', orderId)
      .then((orderData) => {
        // Print the JSON object with text highlighting.
        cliHelper.verticalSpace();
        console.dir(orderData, {colors: true});
        cliHelper.verticalSpace();
      });
  }
};

// Export the module.
module.exports = orderCommand;
