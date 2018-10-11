// Dependencies.
const cliHelper = require('../services/cliHelper');
const database = require('../services/database');

/**
 * Execute "User" command.
 * @param {string} inputString
 */
const userCommand = (inputString) => {
  // Get the email from the string.
  const params = inputString.split('--');
  const email = typeof params[1] === 'string' && params[1].trim().length > 0 ? params[1].trim() : false;
  if (email) {
    // Load the user.
    database.read('users', email)
      .then((userData) => {
        // Print the JSON object with text highlighting.
        cliHelper.verticalSpace();
        console.dir(userData, {colors: true});
        cliHelper.verticalSpace();
      });
  }
};

// Export the module.
module.exports = userCommand;
