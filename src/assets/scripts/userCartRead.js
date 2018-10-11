// Init page module object.
const userCartRead = {};

// Update shopping item quantity.
userCartRead.shoppingCartUpdate = async (itemId, quantity) => {
  return new Promise((resolve, reject) => {
    shoppingCart.updateCart(httpClient, itemId, quantity).then((shoppingCart) => {
      resolve(shoppingCart);
    });
  });
};

// Data preloader.
userCartRead.preloadData = async () => {
  // Load menu items.
  const {statusCode, responsePayload: menuItems} = await httpClient.request({path: '/api/menus', method: 'GET'});

  // Quit if there are no menu items or status code isn't 200.
  if (!menuItems || statusCode !== 200) {
    return false;
  }

  // Load user basket.
  await shoppingCart.getCart(httpClient);

  // Get shopping cart list element.
  const shoppingCartList = document.getElementById('shoppingCartList');

  // If shopping cart is not empty then draw it.
  if (shoppingCart.cart.items && shoppingCart.cart.items.length) {
    shoppingCartList.innerHTML = '';
    shoppingCart.cart.items.forEach((cartItem) => {
      const cartItemObject = menuItems.filter(menuItem => menuItem.id === cartItem.id).pop();
      const cartItemElement = document.createElement('tr');
      const rowId = `shoppingItem_${cartItem.id}`;
      cartItemElement.id = rowId;
      cartItemElement.innerHTML = `
        <td>
          <img src="/assets/images/${cartItemObject.image}" width="70" />
        </td>
        <td class="text-left">
          <b>${cartItem.name}</b>
        </td>
        <td class="text-left">
          <span class="badge badge-light">$${cartItem.price}</span>
        </td>
        <td>
          <input type="number" class="form-control quantity" value="${cartItem.quantity}"/>
        </td>
        <td class="text-right">
          <button type="button" class="btn btn-sm btn-dark deleteItem">Delete</button>
        </td>
      `;
      shoppingCartList.appendChild(cartItemElement);

      // Add event listeners.
      document
        .querySelector(`#${rowId} .deleteItem`)
        .addEventListener('click', (event) => {
          userCartRead.shoppingCartUpdate(cartItem.id, 0).then((shoppingCart) => {
            // Preload data for the current page.
            userCartRead.preloadData().then(() => {});
            app.drawShoppingCartCounter(shoppingCart);
          });
        });

      document
        .querySelector(`#${rowId} .quantity`)
        .addEventListener('change', (event) => {
          const newQuantity = parseInt(event.target.value);
          userCartRead.shoppingCartUpdate(cartItem.id, newQuantity).then((shoppingCart) => {
            // Preload data for the current page.
            userCartRead.preloadData().then(() => {});
            app.drawShoppingCartCounter(shoppingCart);
          });
        });
    });

    // Add total sum and checkout button.
    const cartItemElement = document.createElement('tr');
    cartItemElement.innerHTML = `
        <td></td>
        <td class="text-left"></td>
        <td class="text-left">
          <h5>$${shoppingCart.cart.total}</h5>
        </td>
        <td></td>
        <td class="text-right">
          <a href="/user/order/create" class="btn btn-dark">Checkout ></a>
        </td>
      `;
    shoppingCartList.appendChild(cartItemElement);
  }
};

// Init user current page.
userCartRead.init = () => {
  // Preload data for the current page.
  userCartRead.preloadData().then(() => {});
};

// Call the init processes after the window loads
window.addEventListener('load', userCartRead.init);
