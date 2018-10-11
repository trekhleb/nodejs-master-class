// Dependencies.
const database = require('../../services/database');
const validator = require('../../services/validator');
const verifyUserToken = require('../token/verifyUserToken');
const User = require('../../models/User');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Delete user.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const deleteUser = async (requestData) => {
  // Check that the phone number is valid.
  const email = validator.parseEmail(requestData.queryStringObject.email);
  if (!email) {
    return new ResponseContainer(400, {error: 'Missing required fields'});
  }

  // Get the token from the headers.
  const token = validator.parseString(requestData.headers.token);

  // Verify that the given token is valid for the give email.
  const verifiedToken = await verifyUserToken(token, email);
  if (!verifiedToken) {
    return new ResponseContainer(403, {error: 'Token is invalid'});
  }

  // Lookup the user.
  const userData = await database.read('users', email);

  // Create user instance.
  const user = new User().fromSnapshot(userData);
  await database.delete('users', user.email);
  return new ResponseContainer(200);
};

// Export module.
module.exports = deleteUser;
