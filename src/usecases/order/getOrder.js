// Dependencies.
const database = require('../../services/database');
const ResponseContainer = require('../../models/ResponseContainer');
const User = require('../../models/User');
const Order = require('../../models/Order');
const validator = require('../../services/validator');
const verifyToken = require('../token/verifyToken');

/**
 * Get the order.
 * @param {RequestData} requestData
 * @return {Promise<void>}
 */
const getOrder = async (requestData) => {
  // Get mandatory fields from the request.
  const orderId = validator.parseString(requestData.queryStringObject.id);
  if (!orderId) {
    return new ResponseContainer(400, {error: 'Missing mandatory fields'});
  }

  // Get the token from the headers.
  const tokenId = validator.parseString(requestData.headers.token);

  // Verify user token.
  /** @var {Token} token */
  const token = await verifyToken(tokenId);
  if (!token) {
    return new ResponseContainer(403, {error: 'Token is invalid'})
  }

  // Try to fetch the user from the database.
  const userData = await database.read('users', token.email);
  if (!userData) {
    return new ResponseContainer(400, {error: 'Token not attached to the user'});
  }

  // Create user instance.
  const user = new User().fromSnapshot(userData);

  // Get order instance.
  const orderData = await database.read('orders', orderId);
  if (!orderData) {
    return new ResponseContainer(400, {error: 'Wrong order id'});
  }

  // Create order instance.
  const order = new Order().fromSnapshot(orderData);

  // Check that order belongs to the user.
  if (order.email !== user.email) {
    return new ResponseContainer(403, {error: 'You are not allowed to see this order'});
  }

  // Return order object.
  return new ResponseContainer(200, order);
};

// Export the module.
module.exports = getOrder;
