/**
 * Module that configures available routes in a system.
 */

// Dependencies.
const pingController = require('./controllers/pingController');
const notFoundController = require('./controllers/notFoundController');
const tokenController = require('./controllers/tokenController');
const userController = require('./controllers/userController');
const menuController = require('./controllers/menuController');
const cartController = require('./controllers/cartController');
const orderController = require('./controllers/orderController');
const templateController = require('./controllers/templateController');
const assetsController = require('./controllers/assetsController');

// Create module container.
const router = {};

// Map path to the specific request handler (controller).
router.routes = {
  // API specific routes.
  'api/ping': {
    controller: pingController,
  },

  'api/users': {
    controller: userController,
  },

  'api/tokens': {
    controller: tokenController,
  },

  'api/menus': {
    controller: menuController,
  },

  'api/carts': {
    controller: cartController,
  },

  'api/orders':{
    controller: orderController,
  },

  // Front-End specific routes.
  '': {
    controller: templateController,
    data: {'head.title': 'Pizza Delivery'},
  },

  'assets/*': {
    controller: assetsController,
  },

  'user/account/create': {
    controller: templateController,
    data: {'head.title': 'Create Account'},
  },

  'user/account/edit': {
    controller: templateController,
    data: {'head.title': 'Edit Account'},
  },

  'user/session/create': {
    controller: templateController,
    data: {'head.title': 'Login'},
  },

  'user/cart/read': {
    controller: templateController,
    data: {'head.title': 'Shopping Cart'},
  },

  'user/order/success': {
    controller: templateController,
    data: {'head.title': 'Order has been paid'},
  },

  'user/order/create': {
    controller: templateController,
    data: {'head.title': 'Checkout'},
  },

  'menu/list': {
    controller: templateController,
    data: {'head.title': 'Menu List'},
  },
};

// Define notFound (404) controller.
router.notFound = notFoundController;

// Export the module.
module.exports = router;
