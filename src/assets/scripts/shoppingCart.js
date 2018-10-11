// Create module container.
const shoppingCart = {};

// Shopping cart cached value.
shoppingCart.cart = {};

// Create shopping cart on the back-end.
shoppingCart.createCart = async (httpClient) => {
  return new Promise((resolve, reject) => {
    httpClient.request({method: 'POST', path: '/api/carts'})
      .then(({statusCode, responsePayload}) => {
        if (statusCode === 200) {
          shoppingCart.cart = responsePayload;
          resolve(responsePayload);
        } else {
          reject('Cart already exists');
        }
      })
      .catch(() => {
        shoppingCart.cart = {};
        reject('Request');
      });
  });
};

// Get shopping cart from the back-end (and try to create one if it does not exist).
shoppingCart.getCart = async (httpClient) => {
  return new Promise((resolve, reject) => {
    httpClient.request({method: 'GET', path: '/api/carts'})
      .then(({statusCode, responsePayload}) => {
        if (statusCode === 200) {
          // Cart has been retrieved successfully.
          shoppingCart.cart = responsePayload;
          resolve(responsePayload);
        } else {
          // Try to create cart first.
          shoppingCart.createCart(httpClient)
            .then(({statusCode, responsePayload}) => {
              // Cart has been created successfully.
              shoppingCart.cart = responsePayload;
              resolve(responsePayload);
            })
            .catch((error) => {
              shoppingCart.cart = {};
              reject(error);
            })
        }
      })
      .catch((error) => {
        shoppingCart.cart = {};
        reject(error);
      });
  });
};

// Update shopping cart.
shoppingCart.updateCart = async (httpClient, menuItemId, quantity) => {
  return new Promise((resolve, reject) => {
    httpClient
      .request({
        method: 'PUT',
        path: '/api/carts',
        payload: {id: menuItemId, quantity}
      })
      .then(({statusCode, responsePayload}) => {
        shoppingCart.cart = responsePayload;
        resolve(responsePayload);
      });
  });
};
