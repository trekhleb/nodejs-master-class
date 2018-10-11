/**
 * Parse JSON string to an object in all cases, without throwing.
 * @param {string} str
 * @return {object}
 */
const jsonStringToObject = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};

// Export the module.
module.exports = jsonStringToObject;
