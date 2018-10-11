// Dependencies.
const database = require('../../services/database');
const validator = require('../../services/validator');
const verifyUserToken = require('../token/verifyUserToken');
const User = require('../../models/User');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Update user.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const putUser = async (requestData) => {
  // Check for the required field.
  const email = validator.parseEmail(requestData.payload.email);
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

  // Update user data.
  user.updateFromObject(requestData.payload);

  // Store the new updates.
  await database.update('users', email, user);
  return new ResponseContainer(200, user.toObject());
};

// Export module.
module.exports = putUser;
