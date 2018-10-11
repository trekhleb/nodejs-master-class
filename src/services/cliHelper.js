/**
 * Module that contains CLI related helper functions.
 */

// Create module container.
const cliHelper = {};

// Show a header for the help page that is as wide as a screen.
cliHelper.horizontalLine = () => {
  // Get the available screen size.
  const consoleWidth = process.stdout.columns;

  // Generate the line of correct width.
  let line = '';
  for (let i = 0; i < consoleWidth; i++) {
    line += '-';
  }

  // Draw the line.
  console.log(line);
};

// Show centered text
cliHelper.centered = (str) => {
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get console width.
  const consoleWidth = process.stdout.columns;

  // Calculate the left padding there should be.
  const leftPadding = Math.floor((consoleWidth - str.length) / 2);

  // Add left padding.
  let line = '';
  for (let i = 0; i < leftPadding; i++) {
    line += ' ';
  }

  // Add the string itself.
  line += str;

  // Lost centered string to console.
  console.log(line);
};

// Draw specified number of empty space.
cliHelper.verticalSpace = (linesNumber) => {
  linesNumber = typeof linesNumber === 'number' && linesNumber > 0 ? linesNumber : 1;
  for (let i = 0; i < linesNumber; i++) {
    console.log('');
  }
};

// Export the module.
module.exports = cliHelper;
