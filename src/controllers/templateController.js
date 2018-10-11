/**
 * Controller that dynamically serves request HTML templates based on request path.
 */

// Dependencies.
const ResponseContainer = require('../models/ResponseContainer');
const templateLoader = require('../services/templateLoader');

/**
 * HTML Templates Controller.
 * @param {RequestData} requestData
 * @param {object} [controllerData]
 * @return {Promise}
 */
const templateController = async (requestData, controllerData = {}) => {
  // Reject any request that isn't a GET.
  if (requestData.method !== 'get') {
    return new ResponseContainer(405);
  }

  // Generate template name.
  let requestedTemplateName = requestData.trimmedPath
    // Split the path by '/' to get its parts.
    .split('/')
    // Capitalize first letter of each part and make sure that the rest of the letters are lower-cased.
    .map((part) => {
      if (!part || !part.length) {
        return '';
      }
      return part[0].toUpperCase() + part.slice(1).toLocaleLowerCase();
    })
    // Join the parts into template name.
    .join('');

  if (!requestedTemplateName || !requestedTemplateName.length) {
    // Fall back to menu page.
    requestedTemplateName = 'Index';
  }

  // Add template info to controller data.
  controllerData['body.class'] = requestedTemplateName;

  // Compile template string.
  const templateString = await templateLoader(requestedTemplateName, controllerData);
  if (!templateString) {
    // Can not find a template.
    return new ResponseContainer(404);
  }

  // Return template string to the requester.
  return new ResponseContainer(200, templateString, 'html');
};

// Export the module.
module.exports = templateController;
