/**
 * Module that is responsible for loading assets by name.
 */

// Dependencies.
const fs = require('fs');
const path = require('path');
const util = require('util');

// Promisify file system functions to avoid to callback-inside-callback situation.
const fsReadFile = util.promisify(fs.readFile);

/**
 * Assets loader function.
 * @param {string} assetName
 * @return {Promise<Buffer|string|boolean>}
 */
const assetLoader = async (assetName) => {
  // Check that template name is valid.
  assetName = typeof assetName === 'string' && assetName.length > 0 ? assetName : false;
  if (!assetName) {
    return false;
  }

  // Set up assets base directory.
  const assetsDir = path.join(__dirname, '/../assets/');

  // Try to read the requested asset.
  const assetString = await fsReadFile(`${assetsDir}${assetName}`);

  if (!assetString) {
    // Asset could not be loaded.
    return false;
  }

  return assetString;
};

// Export the module.
module.exports = assetLoader;
