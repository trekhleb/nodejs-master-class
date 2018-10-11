// Dependencies.
const database = require('../../services/database');
const validator = require('../../services/validator');
const verifyToken = require('../token/verifyToken');
const MenuItem = require('../../models/MenuItem');
const ShoppingCart = require('../../models/ShoppingCart');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Add items to the card.
 * @param requestData
 * @return {Promise}
 */
const putCart = async (requestData) => {
  // Get token id from headers.
  const tokenId = validator.parseString(requestData.headers.token);
  const menuItemId = validator.parsePositiveInteger(requestData.payload.id);
  const quantity = validator.parsePositiveInteger(requestData.payload.quantity);

  // Verify if payload is valid.
  if (!menuItemId || quantity < 0) {
    return new ResponseContainer(400, {error: 'Missing required fields'});
  }

  // Verify user token.
  /** @var {Token} token */
  const token = await verifyToken(tokenId);
  if (!token) {
    return new ResponseContainer(403, {error: 'Token is invalid'})
  }

  // Try to fetch user shopping cart.
  const cartData = await database.read('carts', token.email);
  if (!cartData) {
    return new ResponseContainer(404, {error: 'Cart has not been created yet'});
  }

  // Instantiate cart object.
  const shoppingCart = new ShoppingCart().fromSnapshot(cartData);

  // Try to fetch menu item.
  const menuData = await database.read('menus', 'main');
  if (!menuData) {
    return new ResponseContainer(500, {error: 'Menu can not be loaded'});
  }

  // Find requested menu item.
  const menuItemData = menuData.find(menuItem => menuItem.id === menuItemId);

  // Check if menu item was found.
  if (!menuItemData) {
    return new ResponseContainer(400, {error: 'Menu item with provided id can not be found'});
  }

  // Create menu item instance.
  const menuItem = new MenuItem(menuItemData);
  menuItem.quantity = quantity;

  // Add menu item to the shopping cart.
  shoppingCart.update(menuItem);

  // Save shopping cart to database.
  await database.update('carts', token.email, shoppingCart);

  return new ResponseContainer(200, shoppingCart);
};

// Export the module.
module.exports = putCart;
