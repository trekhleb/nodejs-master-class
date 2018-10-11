const database = require('../../services/database');
const validator = require('../../services/validator');
const verifyToken = require('../../usecases/token/verifyToken');
const MenuItem = require('../../models/MenuItem');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Get menu.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const getMenu = async (requestData) => {
  // Get the token from the headers.
  const tokenId = validator.parseString(requestData.headers.token);

  // Verify user token.
  /** @var {Token} token */
  const verifiedToken = await verifyToken(tokenId);
  if (!verifiedToken) {
    return new ResponseContainer(403, {error: 'Token is invalid'})
  }

  // Lookup the menu.
  const defaultMenuId = 'main';
  const rawMenuItems = await database.read('menus', defaultMenuId);

  // Create menu items instances.
  const menuItems = rawMenuItems.map(rawMenuItem => new MenuItem(rawMenuItem).toObject());
  return new ResponseContainer(200, menuItems);
};

// Export module.
module.exports = getMenu;
