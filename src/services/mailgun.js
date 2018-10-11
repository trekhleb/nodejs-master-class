/**
 * Mailgun integration services.
 * @see: https://www.mailgun.com/
 */

// Dependencies.
const querystring = require('querystring');
const config = require('../config');
const https = require('https');
const util = require('util');

// Configure mailgun debugger.
const debug = util.debuglog('mailgun');

// Create library container.
const mailgun = {};

/**
 * Charge the payment.
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @return {Promise}
 */
mailgun.sendEmail = async (to, subject, text) => {
  // Promisify https.request() function.
  return new Promise((resolve, reject) => {
    // Check that all required fields are provided.
    if (!to || !subject || !text) {
      reject(new Error('Missing required fields'));
    }

    // Configure the request payload.
    const payload = {
      to,
      subject,
      text,
      from: config.mailgun.from,
    };

    // Stringify the payload.
    const stringPayload = querystring.stringify(payload);

    // Debug mailgun payload.
    debug('\x1b[33m%s\x1b[0m', stringPayload);

    // Configure the request details.
    const requestDetails = {
      protocol: 'https:',
      hostname: config.mailgun.host,
      method: 'POST',
      path: `/v3/${config.mailgun.domainName}/messages`,
      auth: `${config.mailgun.authUsername}:${config.mailgun.privateKey}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object.
    const request = https.request(requestDetails, (response) => {
      // Grab the status of the sent request.
      const status = response.statusCode;
      // Return successfully if the request went through.
      if (status === 200 || status === 201) {
        resolve();
      } else {
        reject(new Error(`Email sending has failed with status ${status}`));
      }
    });

    // Bind to the error event so it doesn't get thrown.
    request.on('error', (error) => {
      reject(error);
    });

    // Add payload to the request.
    request.write(stringPayload);

    // End the request.
    request.end();
  });
};

// Export the module.
module.exports = mailgun;
