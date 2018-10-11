/**
 * NotFound request handler.
 */

// Dependencies.
const ResponseContainer = require('../models/ResponseContainer');

/**
 * Not found controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const notFoundController = async (requestData) => {
  return new ResponseContainer(404);
};

// Export the module.
module.exports = notFoundController;
