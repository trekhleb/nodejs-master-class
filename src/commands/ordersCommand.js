// Dependencies.
const cliHelper = require('../services/cliHelper');
const database = require('../services/database');

// Set up active time period to display the orders only in certain time frame (24h in ms).
const activeTimeFrame = 24 * 60 * 60 * 1000;

/**
 * Execute "Orders" command.
 * @param {string} inputString
 */
const ordersCommand = (inputString) => {
  // Read orders list.
  database.list('orders')
    .then((orderIds) => {
      orderIds.forEach((orderId) => {
        // Read the order to get additional info.
        database.read('orders', orderId)
          .then((orderData) => {
            // Display only orders in active time frame.
            if (orderData.date > (Date.now() - activeTimeFrame)) {
              // Output order info to the console.
              const line = `ID: ${orderId} • Email: ${orderData.email} • Status: ${orderData.status} • Date: ${new Date(orderData.date).toDateString()}`;
              cliHelper.verticalSpace();
              console.log(line);
              cliHelper.verticalSpace();
            }
          });
      });
    });
};

// Export the module.
module.exports = ordersCommand;
