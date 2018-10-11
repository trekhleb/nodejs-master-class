/**
 * CLI related tasks.
 */

// Dependencies.
const readline = require('readline');
const events = require('events');
const util = require('util');
const helpCommand = require('./commands/helpCommand');
const exitCommand = require('./commands/exitCommand');
const menusCommand = require('./commands/menusCommand');
const ordersCommand = require('./commands/ordersCommand');
const orderCommand = require('./commands/orderCommand');
const usersCommand = require('./commands/usersCommand');
const userCommand = require('./commands/userCommand');

// Setup logging for CLI.
const debug = util.debuglog('cli');

// Setup events class and instance for CLI.
class _events extends events {}
const e = new _events();

// Instantiate CLI module object.
const cli = {};

// Input handlers.
e.on('man', (inputString) => {
  helpCommand(inputString);
});

e.on('help', (inputString) => {
  helpCommand(inputString);
});

e.on('exit', (inputString) => {
  exitCommand(inputString);
});

e.on('menus', (inputString) => {
  menusCommand(inputString);
});

e.on('orders', (inputString) => {
  ordersCommand(inputString);
});

e.on('order', (inputString) => {
  orderCommand(inputString);
});

e.on('users', (inputString) => {
  usersCommand(inputString);
});

e.on('user', (inputString) => {
  userCommand(inputString);
});

// Input processor.
cli.processInput = (inputString) => {
  inputString = typeof inputString === 'string' && inputString.trim().length
    ? inputString.trim().toLowerCase()
    : false;

  // Only process the input if user actually wrote something.
  if (!inputString) {
    return;
  }

  // Codify the unique strings that identify unique questions allowed to be asked.
  const uniqueInputs = [
    'man',
    'help',
    'exit',
    'menus',
    'orders',
    'order',
    'users',
    'user',
  ];

  // Go through the possible inputs and emmit an event when a match is found.
  let matchFound = false;

  uniqueInputs.some((input) => {
    if (inputString.indexOf(input) > -1) {
      matchFound = true;
      // Emit an event matching the unique input, and include the full string given by the user.
      e.emit(input, inputString);
      return true;
    }
  });

  // If no match is found tell the user to try again.
  if (!matchFound) {
    console.log('Sorry, try again');
  }
};

// Init script.
cli.init = () => {
  // Send the start message to the console, in dark blue.
  debug('\x1b[34m%s\x1b[0m', 'CLI is running');

  // Start the interface.
  const interfaceInstance = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  // Create an initial prompt.
  interfaceInstance.prompt();

  // Handle each line of input separately.
  interfaceInstance.on('line', (inputString) => {
    // Send to the input processor.
    cli.processInput(inputString);

    // Re-initialize the prompt afterwards.
    interfaceInstance.prompt();
  });

  // If the user stops the CLI, kill the associated process.
  interfaceInstance.on('close', () => {
    process.exit(0);
  });
};

// Export the module.
module.exports = cli;
