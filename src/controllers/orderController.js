/**
 * Order request handlers.
 */

// Dependencies.
const getOrder = require('../usecases/order/getOrder');
const postOrder = require('../usecases/order/postOrder');
const ResponseContainer = require('../models/ResponseContainer');

/**
 * Order controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
orderController = async (requestData) => {
  switch (requestData.method) {
    case 'get':
      return await getOrder(requestData);

    case 'post':
      return await postOrder(requestData);

    default:
      return new ResponseContainer(405, {error: 'Method is not allowed'});
  }
};

// Export the module.
module.exports = orderController;
