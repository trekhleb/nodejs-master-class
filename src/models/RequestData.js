/**
 * Request data class.
 */
class RequestData {
  /**
   * @param {string} trimmedPath
   * @param {object} queryStringObject
   * @param {string} method
   * @param {object} headers
   * @param {object} payload
   */
  constructor({trimmedPath, queryStringObject, method, headers, payload}) {
    this.trimmedPath = trimmedPath;
    this.queryStringObject = queryStringObject;
    this.method = method;
    this.headers = headers;
    this.payload = payload;
  }
}

// Export the module.
module.exports = RequestData;
