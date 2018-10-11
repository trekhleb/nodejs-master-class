// Dependencies.
const validator = require('../services/validator');
const passwordHash = require('../services/passwordHash');

/**
 * Class User.
 * Describes main User related fields and their validation rules.
 */
class User {
  /**
   * Create user instance from object.
   * @param {string} name - User name.
   * @param {string} email - User email.
   * @param {string} address - User address.
   * @param {string} streetAddress - User street address.
   * @param {string} password - User password.
   * @return {User}
   */
  fromObject({name, email, address, streetAddress, password}) {
    this.name = validator.parseString(name);
    this.address = validator.parseString(address);
    this.streetAddress = validator.parseString(streetAddress);
    this.email = validator.parseEmail(email);
    this.hashedPassword = passwordHash(validator.parseString(password));
    this.orders = [];

    // Return self instance.
    return this;
  }

  /**
   * Create user instance from database snapshot.
   * @param {string} name - User name.
   * @param {string} email - User email.
   * @param {string} address - User address.
   * @param {string} streetAddress - User street address.
   * @param {string} hashedPassword - Hashed user password.
   * @param {*[]} orders - User orders.
   * @return {User}
   */
  fromSnapshot({name, email, address, streetAddress, hashedPassword, orders}) {
    this.name = name;
    this.address = address;
    this.streetAddress = streetAddress;
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.orders = orders;

    // Return self instance.
    return this;
  }

  /**
   * Check if all user fields are filled and are correct.
   * @return {boolean}
   */
  isValid() {
    return this.name && this.email && this.address && this.streetAddress;
  }

  /**
   * Update user instance with new values.
   * @param {string} [name]
   * @param {string} [address]
   * @param {string} [streetAddress]
   * @param {string} [password]
   */
  updateFromObject({name, address, streetAddress, password}) {
    const parsedName = validator.parseString(name);
    const parsedAddress = validator.parseString(address);
    const parsedStreetAddress = validator.parseString(streetAddress);
    const parsedHashedPassword = passwordHash(validator.parseString(password));

    if (parsedName) {
      this.name = parsedName;
    }

    if (parsedAddress) {
      this.address = parsedAddress;
    }

    if (parsedStreetAddress) {
      this.streetAddress = parsedStreetAddress;
    }

    if (parsedHashedPassword) {
      this.hashedPassword = parsedHashedPassword;
    }
  }

  /**
   * Create public representation og the user.
   * @return {object}
   */
  toObject() {
    return {
      name: this.name,
      address: this.address,
      streetAddress: this.streetAddress,
      email: this.email,
      orders: this.orders,
    };
  }
}

// Export the module.
module.exports = User;
