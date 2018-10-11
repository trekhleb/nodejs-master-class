/**
 * Controller that dynamically serves request HTML templates based on request path.
 */

// Dependencies.
const ResponseContainer = require('../models/ResponseContainer');
const assetLoader = require('../services/assetLoader');

/**
 * Assets Controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
const assetsController = async (requestData) => {
  // Reject any request that isn't a GET.
  if (requestData.method !== 'get') {
    return new ResponseContainer(405);
  }

  // Generate template name.
  const trimmedAssetName = requestData.trimmedPath.replace('assets/', '').trim();

  // Compile template string.
  const assetData = await assetLoader(trimmedAssetName);
  if (!assetData) {
    // Can not find a template.
    return new ResponseContainer(404);
  }

  // Get asset extension.
  const assetExtension = trimmedAssetName.split('.').pop().toLowerCase();

  // Return the asset to the requester.
  return new ResponseContainer(200, assetData, assetExtension);
};

// Export the module.
module.exports = assetsController;
