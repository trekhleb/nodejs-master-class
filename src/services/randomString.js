/**
 * Create a string of random alphanumeric characters, of a given length.
 * @param {number} strLength
 * @return {string|null}
 */
const createRandomString = (strLength) => {
  strLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string.
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';

    // Start the final string.
    let str = '';

    for (let i = 0; i < strLength; i += 1) {
      // Get a random character from the possibleCharacters string.
      // Append this character to the final string.
      str += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }

    // Return the final string.
    return str;
  } else {
    return null;
  }
};

// Export module.
module.exports = createRandomString;
