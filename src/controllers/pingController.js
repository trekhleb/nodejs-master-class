/**
 * Ping request handler.
 */

// Dependencies.
const ResponseContainer = require('../models/ResponseContainer');

/**
 * Ping controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const pingController = async (requestData) => {
  return new ResponseContainer(200);
};

// Export the module.
module.exports = pingController;
