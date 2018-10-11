// Dependencies.
const database = require('../../services/database');
const Token = require('../../models/Token');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Create token for user.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const postToken = async (requestData) => {
  // Get raw token data.
  const rawTokenData = requestData.payload;

  // Create token instance.
  const token = new Token().fromObject(rawTokenData);

  // Check if token has all required input data.
  if (!token.isValid()) {
    return new ResponseContainer(400, {error: 'Missing required fields'});
  }

  // Lookup the user who matches that email number.
  const userData = await database.read('users', token.email);
  if (!userData) {
    return new ResponseContainer(400, {error: 'Could not find specified user'});
  }

  // Compare token hashed password with user's hashed password.
  if (token.hashedPassword !== userData.hashedPassword) {
    return new ResponseContainer(400, {error: 'Password did not match the specified user\'s stored password'});
  }

  // If valid, create a new token.
  await database.create('tokens', token.id, token);
  return new ResponseContainer(200, token.toObject());
};

// Export module.
module.exports = postToken;
