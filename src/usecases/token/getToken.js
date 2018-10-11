// Dependencies.
const database = require('../../services/database');
const Token = require('../../models/Token');
const validator = require('../../services/validator');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Read token.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const getToken = async (requestData) => {
  // Check that the id is valid.
  const id = validator.parseString(requestData.queryStringObject.id);

  if (!id) {
    return new ResponseContainer(400, {error: 'Missing required fields'});
  }

  // Lookup the token.
  const tokenData = await database.read('tokens', id);
  if (!tokenData) {
    return new ResponseContainer(404);
  }

  // Create token instance.
  const token = new Token().fromSnapshot(tokenData);
  return new ResponseContainer(200, token.toObject());
};

// Export module.
module.exports = getToken;
