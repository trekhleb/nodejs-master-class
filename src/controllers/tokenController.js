/**
 * Token request handlers.
 */

// Dependencies.
const putToken = require('../usecases/token/putToken');
const getToken = require('../usecases/token/getToken');
const postToken = require('../usecases/token/postToken');
const deleteToken = require('../usecases/token/deleteToken');
const ResponseContainer = require('../models/ResponseContainer');

/**
 * Tokens controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
tokenController = async (requestData) => {
  switch (requestData.method) {
    case 'get':
      return await getToken(requestData);

    case 'post':
      return await postToken(requestData);

    case 'put':
      return await putToken(requestData);

    case 'delete':
      return await deleteToken(requestData);

    default:
      return new ResponseContainer(405, {error: 'Method is not allowed'});
  }
};

// Export the module.
module.exports = tokenController;
