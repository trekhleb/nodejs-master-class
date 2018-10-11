// Map custom short content type name to its full HTTP version.
const contentTypeMap = {
  'json': 'application/json',
  'map': 'application/json',
  'js': 'text/javascript',
  'plain': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'favicon': 'image/x-icon',
};

// Setup default content type.
const defaultContentType = 'json';

/**
 * ResponseContainer class that is used as container for API response data.
 */
class ResponseContainer {
  /**
   * Response constructor.
   * @param {number} statusCode
   * @param {object|string} [payload]
   * @param {string} [contentType]
   */
  constructor(statusCode = 200, payload = {}, contentType = defaultContentType) {
    this.statusCode = statusCode;

    // Parse content type.
    this.contentType = contentType;
    this.contentTypeString = contentTypeMap[contentType] || contentTypeMap[defaultContentType];

    // Parse payload.
    this.payload = payload;
    this.payloadString = this.parsePayload(payload, contentType);
  }


  /**
   * Parse payload accordingly to its content type.
   * @param {*} payload
   * @param {string} contentType
   * @return {string}
   */
  parsePayload(payload, contentType) {
    // If content type is JSON and payload is an object we need to stringify it.
    if (contentType === 'json') {
      payload = typeof payload === 'object' && payload ? JSON.stringify(payload) : '';
    }

    // Return content ype as is unless it is undefined.
    return typeof payload !== 'undefined' ? payload : '';
  }
}

// Export the module.
module.exports = ResponseContainer;
