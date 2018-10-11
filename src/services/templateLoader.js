/**
 * Module that is responsible for loading HTML templates by name.
 */

// Dependencies.
const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../config');

// Promisify file system functions to avoid to callback-inside-callback situation.
const fsReadFile = util.promisify(fs.readFile);

// Take a given string and a data object and find/replace all the key within it.
const interpolate = (string, data = {}) => {
  // Add template globals to the data object prepending the key name with "global.".
  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data[`global.${keyName}`] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object we want to insert each value into the string at the corresponding key.
  for (let key in data) {
    if (
      data.hasOwnProperty(key) && typeof data[key] === 'string' ||
      data.hasOwnProperty(key) && typeof data[key] === 'number'
    ) {
      const replace = data[key];
      const find = `{${key}}`;
      string = string.replace(find, replace);
    }
  }

  return string;
};

/**
 * Template loader function.
 * @param {string} templateName
 * @param {object} [templateData]
 * @return {Promise<string|boolean>}
 */
const templateLoader = async (templateName, templateData = {}) => {
  // Check that template name is valid.
  templateName = typeof templateName === 'string' && templateName.length > 0 ? templateName : false;
  if (!templateName) {
    return false;
  }

  // Set up template base directory.
  const templatesDir = path.join(__dirname, '/../templates/');

  // Try to read the requested template.
  const templateString = await fsReadFile(`${templatesDir}${templateName}.html`, 'utf8');

  // Try to read the template wrapper.
  const templateWrapperString = await fsReadFile(`${templatesDir}TemplateWrapper.html`, 'utf8');

  if (!templateString || !templateWrapperString) {
    // Either template does not exist of template wrapper has not been loaded.
    return false;
  }

  // Embed requested template into template wrapper.
  const compiledTemplate = templateWrapperString.replace('{{pageContent}}', templateString);

  // Embed variable values.
  const interpolatedTemplate = interpolate(compiledTemplate, templateData);

  return interpolatedTemplate;
};

// Export the module.
module.exports = templateLoader;
