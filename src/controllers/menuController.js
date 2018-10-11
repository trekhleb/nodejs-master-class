/**
 * Menu request handlers.
 */

// Dependencies.
const getMenu = require('../usecases/menu/getMenu');
const ResponseContainer = require('../models/ResponseContainer');

/**
 * Menu controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
userController = async (requestData) => {
  switch (requestData.method) {
    case 'get':
      return await getMenu(requestData);

    default:
      return new ResponseContainer(405, {error: 'Method is not allowed'});
  }
};

// Export the module.
module.exports = userController;
