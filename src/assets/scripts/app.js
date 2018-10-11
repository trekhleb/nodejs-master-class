/**
 * Frontend logic for application.
 */

// Container for frontend application.
const app = {};

// Bind the logout button.
app.bindLogoutButton = () => {
  document.getElementById('logoutButton').addEventListener('click', (event) => {
    // Stop it from redirecting anywhere
    event.preventDefault();
    // Log the user out
    auth.logUserOut(httpClient).then(() => {
      window.location = '/';
    });
  });
};

// Set (or remove) the loggedIn class from the body.
app.setLoggedInClass = (isLoggedIn) => {
  const target = document.querySelector('body');
  if (isLoggedIn) {
    target.classList.remove('loggedOut');
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
    target.classList.add('loggedOut');
  }
};

// Draw shopping cart counter details on the page.
app.drawShoppingCartCounter = (shoppingCart) => {
  const totalItems = shoppingCart.items && shoppingCart.items.length
    ? shoppingCart.items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
  const shoppingCartCounter = document.getElementById('shoppingCartCounter');
  shoppingCartCounter.innerHTML = `${totalItems}`;
};

// Init (bootstrapping).
app.init = () => {
  // Get the token.
  const token = auth.getToken();
  app.setLoggedInClass(!!token);
  if (token) {
    // Set token to the http client default headers.
    httpClient.defaults.headers = {token: token.id};

    // Get shopping cart and update shopping cart number of items.
    shoppingCart.getCart(httpClient)
      .then((shoppingCart) => {
        app.drawShoppingCartCounter(shoppingCart);
      });
  }

  // Bind logout button.
  app.bindLogoutButton();

  // Bind all form submissions.
  formProcessor.bindForms(httpClient);
};

// Call the init processes after the window loads.
window.addEventListener('load', app.init);
