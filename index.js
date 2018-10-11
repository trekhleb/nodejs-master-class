/**
 * Primary file for the API.
 */

// Dependencies.
const server = require('./src/server');
const cli = require('./src/cli');

// Declare the app.
const app = {};

// Init function.
app.init = () => {
  // Start the server.
  server.init();

  // Start the CLI, but make sure it starts last.
  setTimeout(() => {cli.init()}, 50);
};

// Execute.
app.init();

// Export the module.
module.exports = app;
