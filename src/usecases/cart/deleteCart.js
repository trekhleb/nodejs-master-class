// Dependencies.
const validator = require('../../services/validator');
const database = require('../../services/database');
const verifyToken = require('../token/verifyToken');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Delete cart.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const deleteCart = async (requestData) => {
  // Get user token.
  const tokenId = validator.parseString(requestData.headers.token);

  // Verify user token.
  /** @var {Token} token */
  const verifiedToken = await verifyToken(tokenId);
  if (!verifiedToken) {
    return new ResponseContainer(403, {error: 'Token is invalid'})
  }

  // Extract email from the token.
  const email = verifiedToken.email;

  // Try to load the basket by user email.
  const cart = await database.read('carts', email);
  if (!cart) {
    return new ResponseContainer(404, {error: 'Cart does not exists'});
  }

  // Try to delete existing cart.
  await database.delete('carts', email);

  return new ResponseContainer(200);
};

// Export the module.
module.exports = deleteCart;
