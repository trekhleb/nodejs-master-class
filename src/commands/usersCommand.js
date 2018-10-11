// Dependencies.
const cliHelper = require('../services/cliHelper');
const database = require('../services/database');
const config = require('../config');

// Set up active time period to display the users that logged in within 24 hours.
const activeTimeFrame = 24 * 60 * 60 * 1000; // 24h in ms.

/**
 * Execute "Users" command.
 * @param {string} inputString
 */
const usersCommand = (inputString) => {
  const activeUsers = {};

  // Read tokens list.
  database.list('tokens')
    .then((tokenIds) => {
      // Go through all the tokens and detect whether they were created in last 24 hours.
      tokenIds.forEach((tokenId) => {
        // Load token details.
        database.read('tokens', tokenId)
          .then((tokenData) => {
            const tokenCreationTime = tokenData.expires - config.tokenLifetime;
            // Check that user has been logged in within required time frame.
            if (tokenCreationTime > (Date.now() - activeTimeFrame)) {
              // Add token's owner to the list of active users if it isn't there yet.
              if (!activeUsers[tokenData.email]) {
                activeUsers[tokenData.email] = true;
                // Output user info to the console.
                const line = tokenData.email;
                cliHelper.verticalSpace();
                console.log(line);
                cliHelper.verticalSpace();
              }
            }
          });
      });
    });
};

// Export the module.
module.exports = usersCommand;
