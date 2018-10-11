// Dependencies.
const validator = require('../../services/validator');
const database = require('../../services/database');
const ShoppingCart = require('../../models/ShoppingCart');
const verifyToken = require('../token/verifyToken');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Get cart.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const getCart = async (requestData) => {
  // Get user token.
  const tokenId = validator.parseString(requestData.headers.token);

  // Verify user token.
  /** @var {Token} token */
  const token = await verifyToken(tokenId);
  if (!token) {
    return new ResponseContainer(403, {error: 'Token is invalid'})
  }

  // Extract email from token.
  const email = token.email;

  // Try to load the basket by user email.
  const cartData = await database.read('carts', email);
  if (!cartData) {
    return new ResponseContainer(404, {error: 'Cart has not been created yet'});
  }

  // Instantiate cart object.
  const cart = new ShoppingCart().fromSnapshot(cartData);
  return new ResponseContainer(200, cart.toObject());
};

// Export the module.
module.exports = getCart;
