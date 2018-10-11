/**
 * Execute "Exit" command.
 * @param {string} inputString
 */
const exitCommand = (inputString) => {
  process.exit(0);
};

// Export the module.
module.exports = exitCommand;
