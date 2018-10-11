/**
 * Stripe integration services.
 * @see: https://stripe.com/
 */

// Dependencies.
const querystring = require('querystring');
const config = require('../config');
const https = require('https');
const util = require('util');

// Configure stripe debugger.
const debug = util.debuglog('stripe');

// Create library container.
const stripe = {};

/**
 * Charge the payment.
 * @param {number} amount - Amount of money that will be charged (e.g., 100 cents to charge $1.00).
 * @param {string} currency - Three-letter ISO currency code, in lowercase.
 * @param {string} source - A payment source to be charged (i.e. ID of a card, a bank account, a source, a token).
 * @param {object} [metadata] - Set of key-value pairs that you can attach to an object.
 * @param {string} [description] - An arbitrary string which you can attach to a Charge object.
 * @return {Promise<boolean>}
 */
stripe.charge = async ({amount, currency, source, metadata = {}, description = ''}) => {
  // Promisify https.request() function.
  return new Promise((resolve, reject) => {
    // Check that all required fields are provided.
    if (!amount || !source || !currency) {
      reject(new Error('Missing required payment fields'));
    }

    // Configure the request payload.
    const payload = {
      amount,
      currency,
      source,
      description,
      metadata,
    };

    // Stringify the payload.
    const stringPayload = querystring.stringify(payload);

    // Debug stripe payload.
    debug('\x1b[33m%s\x1b[0m', stringPayload);

    // Configure the request details.
    const requestDetails = {
      protocol: 'https:',
      hostname: config.stripe.host,
      method: 'POST',
      path: '/v1/charges',
      auth: `${config.stripe.secretKey}:`,
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
        reject(new Error(`Payment has failed with status ${status}`));
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
module.exports = stripe;
