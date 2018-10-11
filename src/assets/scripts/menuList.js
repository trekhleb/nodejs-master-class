// Init page module object.
const menuList = {};

// Cached menu items.
menuList.items = [];

// Data preloader.
menuList.preloadData = () => {
  // Get menu items container and clean it up.
  const menuItemsContainer = document.getElementById('menuItemsContainer');
  menuItemsContainer.innerHTML = '';

  // Fetch the menu data.
  httpClient.request({path: '/api/menus', method: 'GET'})
    .then(({statusCode, responsePayload}) => {
      menuList.items = responsePayload;
      responsePayload.forEach((menuItem) => {
        const containerId = `menuItem_${menuItem.id}`;
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'card text-center';
        menuItemElement.id = containerId;
        menuItemElement.innerHTML = `
          <img class="card-img-top mt-2" src="/assets/images/${menuItem.image}">
          <div class="card-body">
            <h5 class="card-title">${menuItem.name}</h5>
            <a href="#" class="btn btn-sm btn-dark mr-sm-1 addToCart">Add to Cart</a>
            <span class="badge badge-light ml-sm-1">$${menuItem.price}</span>
          </div>
        `;
        menuItemsContainer.appendChild(menuItemElement);

        // Add event listeners to "Add to Cart" button.
        document
          .querySelector(`#${containerId} a.addToCart`)
          .addEventListener('click', (event) => {
            event.preventDefault();

            // Detect how many of items with current id are already in the basket.
            // Then increment its value.
            const basketItems = shoppingCart.cart.items || [];
            const existingItem = basketItems.filter(basketItem => basketItem.id === menuItem.id).pop();
            const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

            shoppingCart.updateCart(httpClient, menuItem.id, newQuantity)
              .then((shoppingCart) => {
                app.drawShoppingCartCounter(shoppingCart);
              });
          });
      });
    });
};

// Init user current page.
menuList.init = () => {
  // Preload data for the current page.
  menuList.preloadData();
};

// Call the init processes after the window loads
window.addEventListener('load', menuList.init);
