// Dependencies.
const database = require('../../services/database');
const verifyUserToken = require('../token/verifyUserToken');
const User = require('../../models/User');
const validator = require('../../services/validator');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Get user info.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const getUser = async (requestData) => {
  // Check that the phone number is valid.
  const email = validator.parseEmail(requestData.queryStringObject.email);
  if (!email) {
    return new ResponseContainer(400, {error: 'Missing required fields'});
  }

  // Get the token from the headers.
  const token = validator.parseString(requestData.headers.token);

  // Verify that the given token is valid for the phone number.
  const verifiedToken = await verifyUserToken(token, email);
  if (!verifiedToken) {
    return new ResponseContainer(403, {error: 'Token is invalid'});
  }

  // Lookup the user.
  const userData = await database.read('users', email);

  // Create user instance.
  const user = new User().fromSnapshot(userData);
  return new ResponseContainer(200, user.toObject());
};

// Export module.
module.exports = getUser;
