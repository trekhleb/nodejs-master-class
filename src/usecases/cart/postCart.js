// Dependencies.
const database = require('../../services/database');
const ShoppingCart = require('../../models/ShoppingCart');
const verifyToken = require('../token/verifyToken');
const validator = require('../../services/validator');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Create cart.
 * @param {object} requestData
 * @return {Promise}
 */
const postCart = async (requestData) => {
  // Get user token.
  const tokenId = validator.parseString(requestData.headers.token);

  // Verify user token.
  /** @var {Token} token */
  const token = await verifyToken(tokenId);
  if (!token) {
    return new ResponseContainer(403, {error: 'Token is invalid'})
  }

  // Try to load the basket by user email.
  const cartData = await database.read('carts', token.email);
  if (cartData) {
    return new ResponseContainer(409, {error: 'Cart already exists'});
  }

  // Cart doesn't exists. Let's create one.
  const cart = new ShoppingCart();
  await database.create('carts', token.email, cart);
  return new ResponseContainer(200, cart.toObject());
};

// Export module.
module.exports = postCart;
