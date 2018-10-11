// Dependencies.
const cliHelper = require('../services/cliHelper');

// Padding that should be preserved when displaying the table of available commands.
const commandPadding = 40;

/**
 * Execute "Man/Help" command.
 * @param {string} inputString
 */
const helpCommand = (inputString) => {
  const commands = {
    'exit': 'Kill the CLI (and the rest of the application)',
    'man': 'Show this help page',
    'help': 'Alis of the "man" command',
    'menus': 'Show the list of available menu items (pizzas)',
    'orders': 'View all the recent orders in the system (orders placed in the last 24 hours)',
    'order --{orderId}': 'Lookup the details of a specific order by order ID',
    'users': 'View all the users who have signed up in the last 24 hours',
    'user --{email}': 'Lookup the details of a specific user by email address',
  };

  cliHelper.horizontalLine();
  cliHelper.centered('CLI Manual');
  cliHelper.horizontalLine();
  cliHelper.verticalSpace(2);

  // Show each command, followed by its explanation in white and yellow respectively.
  for (let key in commands) {
    if (!commands.hasOwnProperty(key)) {
      continue;
    }

    // Get colored key string.
    const value = commands[key];
    let line = `\x1b[33m${key}\x1b[0m`;

    // Add padding.
    const padding = commandPadding - line.length;
    for (let i = 0; i < padding; i++) {
      line += ' ';
    }

    // Add description of the command.
    line += value;

    // Output command help line along with new line.
    console.log(line);
    cliHelper.verticalSpace();
  }

  // End with another horizontal line.
  cliHelper.horizontalLine();
  cliHelper.verticalSpace();
};

// Export the module.
module.exports = helpCommand;
