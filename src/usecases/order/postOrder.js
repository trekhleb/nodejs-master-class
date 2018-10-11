// Dependencies.
const database = require('../../services/database');
const ResponseContainer = require('../../models/ResponseContainer');
const User = require('../../models/User');
const Order = require('../../models/Order');
const ShoppingCart = require('../../models/ShoppingCart');
const validator = require('../../services/validator');
const verifyToken = require('../token/verifyToken');
const stripe = require('../../services/stripe');
const mailgun = require('../../services/mailgun');

/**
 * Create the order.
 * @param {RequestData} requestData
 * @return {Promise<void>}
 */
const postOrder = async (requestData) => {
  // Check if payment source is provided in the request.
  const paymentSource = validator.parseString(requestData.payload.paymentSource);
  if (!paymentSource) {
    return new ResponseContainer(400, {error: 'Missing required fields'});
  }

  // Get the token from the headers.
  const tokenId = validator.parseString(requestData.headers.token);

  // Verify user token.
  /** @var {Token} token */
  const token = await verifyToken(tokenId);
  if (!token) {
    return new ResponseContainer(403, {error: 'Token is invalid'})
  }

  // Try to fetch the user from the database.
  const userData = await database.read('users', token.email);
  if (!userData) {
    return new ResponseContainer(400, {error: 'Token not attached to the user'});
  }

  // Create user instance.
  const user = new User().fromSnapshot(userData);

  // Check if use has shopping cart.
  const shoppingCartData = await database.read('carts', user.email);
  if (!shoppingCartData) {
    return new ResponseContainer(409, {error: 'User does not have a shopping cart'});
  }

  // Create shopping cart instance.
  const shoppingCart = new ShoppingCart().fromSnapshot(shoppingCartData);

  // Check if shopping cart is not empty.
  if (shoppingCart.total === 0 && shoppingCart.items.length === 0) {
    return new ResponseContainer(409, {error: 'Shopping cart is empty'});
  }

  // Create order instance.
  const order = new Order();
  order.amount = shoppingCart.total;
  order.items = shoppingCart.items.map(item => ({...item}));
  order.paymentSource = paymentSource;
  order.email = user.email;

  // Check if order is valid.
  if (!order.isValid()) {
    return new ResponseContainer(400, {error: 'Order is invalid'});
  }

  // Create order instance in database.
  await database.create('orders', order.id, order);

  // Clean up user shopping cart.
  await database.update('carts', user.email, new ShoppingCart());

  // Add order Id to user orders.
  user.orders.push(order.id);

  // Persist user order to database.
  await database.update('users', user.email, user);

  // Pay for the order with Stripe.
  try {
    await stripe.charge({
      amount: order.amount * 100,
      source: order.paymentSource,
      currency: order.currency,
      description: `Order #${order.id} from ${order.email}`,
      metadata: {
        id: order.id,
        email: order.email,
        items: order.items,
      }
    });
    // Update order status.
    order.status = 'payed';
    await database.update('orders', order.id, order);
  } catch (error) {
    // Update order status.
    order.status = 'error';
    await database.update('orders', order.id, order);

    return new ResponseContainer(500, {error: error.message});
  }

  // In case of successful payment send user an email with order details.
  const subject = `Invoice for order #${order.id}`;
  const message = `
    Your payment for the order #${order.id} was successful!
    Order amount: ${order.amount} USD
  `;
  await mailgun.sendEmail(user.email, subject, message);

  // Returned payed order to the user.
  return new ResponseContainer(200, order);
};

// Export the module.
module.exports = postOrder;
