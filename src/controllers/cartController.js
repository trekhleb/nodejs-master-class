/**
 * Cart request handlers.
 */

// Dependencies.
const getCart = require('../usecases/cart/getCart');
const postCart = require('../usecases/cart/postCart');
const deleteCart = require('../usecases/cart/deleteCart');
const putCart = require('../usecases/cart/putCart');
const ResponseContainer = require('../models/ResponseContainer');

/**
 * Cart controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
cartController = async (requestData) => {
  switch (requestData.method) {
    case 'get':
      return await getCart(requestData);

    case 'post':
      return await postCart(requestData);

    case 'delete':
      return await deleteCart(requestData);

    case 'put':
      return await putCart(requestData);

    default:
      return new ResponseContainer(405, {error: 'Method is not allowed'});
  }
};

// Export the module.
module.exports = cartController;
