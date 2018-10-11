// Dependencies.
const database = require('../../services/database');
const User = require('../../models/User');
const ResponseContainer = require('../../models/ResponseContainer');

/**
 * Create user.
 * @param {object} requestData
 * @return {Promise}
 */
const postUser = async (requestData) => {
  // Get raw user request data.
  const userRawData = requestData.payload;

  // Create User instance from raw data.
  const user = new User().fromObject(userRawData);

  // Check if user instance has all required fields.
  if (!user.isValid()) {
    return new ResponseContainer(400, {error: 'Missing required fields'});
  }

  // Make sure that the use doesn't already exists.
  const userData = await database.read('users', user.email);
  if (userData) {
    return new ResponseContainer(400, {error: 'A user with that email already exists'});
  }

  // Store the user.
  await database.create('users', user.email, user);
  return new ResponseContainer(200, user.toObject());
};

// Export module.
module.exports = postUser;
