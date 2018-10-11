/**
 * Create and export configuration variables.
 */

// General container for all the environments.
const environments = {};

// Staging (default) environment.
environments.staging = {
  httpPort: 3000,
  environmentName: 'staging',
  hashingSecret: 'thisIsASecret',
  tokenLifetime: 1000 * 60 * 60,
  stripe: {
    host: 'api.stripe.com',
    secretKey: 'sk_test_XXXXXXXXXXXXXXXXXXXXXX',
  },
  mailgun: {
    domainName: 'sandboxXXXXXXXXXXXXXXXXXX.mailgun.org',
    host: 'api.mailgun.net',
    authUsername: 'api',
    privateKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
    from: 'postmaster@sandboxXXXXXXXXXXXXXXXXXX.mailgun.org'
  },
  templateGlobals: {
    appName: 'Pizza Delivery'
  }
};

// Production environment.
environments.production = {
  httpPort: 5000,
  environmentName: 'production',
  hashingSecret: 'thisIsAlsoASecret',
  tokenLifetime: 1000 * 60 * 60,
  stripe: {
    host: 'api.stripe.com',
    secretKey: 'sk_test_XXXXXXXXXXXXXXXXXXXXXX',
  },
  mailgun: {
    domainName: 'sandboxXXXXXXXXXXXXXXXXXX.mailgun.org',
    host: 'api.mailgun.net',
    authUsername: 'api',
    privateKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
    from: 'postmaster@sandboxXXXXXXXXXXXXXXXXXX.mailgun.org'
  }
};

// Determine which environment was passed as command-line argument.
const currentEnvironment = typeof process.env.NODE_ENV === 'string'
  ? process.env.NODE_ENV.toLocaleLowerCase()
  : '';

// Check that current environment is one of the environments above, if not, default to staging.
const environmentToExport = typeof environments[currentEnvironment] === 'object'
  ? environments[currentEnvironment]
  : environments.staging;

// Export the module.
module.exports = environmentToExport;
