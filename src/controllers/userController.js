/**
 * User request handlers.
 */

// Dependencies.
const putUser = require('../usecases/user/putUser');
const getUser = require('../usecases/user/getUser');
const postUser = require('../usecases/user/postUser');
const deleteUser = require('../usecases/user/deleteUser');
const ResponseContainer = require('../models/ResponseContainer');

/**
 * Users controller.
 * @param {RequestData} requestData
 * @return {Promise}
 */
userController = async (requestData) => {
  switch (requestData.method) {
    case 'get':
      return await getUser(requestData);

    case 'post':
      return await postUser(requestData);

    case 'put':
      return await putUser(requestData);

    case 'delete':
      return await deleteUser(requestData);

    default:
      return new ResponseContainer(405, {error: 'Method is not allowed'});
  }
};

// Export the module.
module.exports = userController;
