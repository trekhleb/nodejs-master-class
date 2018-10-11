// Dependencies.
const database = require('../../services/database');
const Token = require('../../models/Token');

/**
 * Verify if a given token id is valid and not expired.
 * @param {string} id - Token id.
 * @return {Promise<boolean|Token>}
 */
const verifyToken = async (id) => {
  // Lookup the token.
  const tokenData = await database.read('tokens', id);

  if (!tokenData) {
    return false;
  }

  // Create token instance.
  const token = new Token().fromSnapshot(tokenData);

  // Check that the token is for given user and has not expired.
  return !token.isExpired() ? token : false;
};

// Export module.
module.exports = verifyToken;
