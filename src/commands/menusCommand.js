// Dependencies.
const cliHelper = require('../services/cliHelper');
const database = require('../services/database');

/**
 * Execute "Menus" command.
 * @param {string} inputString
 */
const menusCommand = (inputString) => {
  // Load the menu.
  database.read('menus', 'main')
    .then((menuItems) => {
      // Go through all menu items and print them to the console.
      menuItems.forEach((menuItem) => {
        console.dir(menuItem, {colors: true});
        cliHelper.verticalSpace();
      });
    });
};

// Export the module.
module.exports = menusCommand;
