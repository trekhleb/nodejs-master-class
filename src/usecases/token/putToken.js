// Dependencies.
const database = require('../../services/database');
const Token = require('../../models/Token');
const validator = require('../../services/validator');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Prolong token.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const putToken = async (requestData) => {
  const id = validator.parseString(requestData.payload.id);
  if (!id) {
    return new ResponseContainer(400, {error: 'Missing required field(s) or field(s) are invalid'});
  }

  // Lookup the token.
  const tokenData = await database.read('tokens', id);
  if (!tokenData) {
    return new ResponseContainer(400, {error: 'Token does not exists'});
  }

  // Create token instance.
  const token = new Token().fromSnapshot(tokenData);

  // Check to make sure the token isn't already expired.
  if (token.isExpired()) {
    return new ResponseContainer(400, {error: 'The token has already expired, and can not be extended'});
  }

  // Set the expiration an hour from now.
  token.prolong();

  // Store the new updates.
  await database.update('tokens', id, token);
  return new ResponseContainer(200);
};

// Export module.
module.exports = putToken;
