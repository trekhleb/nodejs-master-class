// Init page module object.
const userAccountEdit = {};

// Data preloader.
userAccountEdit.preloadData = () => {
  // Get the email number from the current token, or log the user out if none is there.
  const token = auth.getToken();
  const email = token && token.email || false;
  if (!email) {
    auth.logUserOut(httpClient).then(() => {
      window.location = '/';
    });
  }

  // Fetch the user data
  const queryStringObject = {email};
  httpClient.request({path: '/api/users', method: 'GET', queryStringObject})
    .then(({statusCode, responsePayload}) => {
      if (statusCode === 200) {
        // Put the data into the forms as values where needed
        document.querySelector('#userAccountEdit input[name=email]').value = responsePayload.email;
        document.querySelector('#userAccountEdit input[name=name]').value = responsePayload.name;
        document.querySelector('#userAccountEdit input[name=address]').value = responsePayload.address;
        document.querySelector('#userAccountEdit input[name=streetAddress]').value = responsePayload.streetAddress;
      } else {
        // If the request comes back as something other than 200, log the user our.
        auth.logUserOut(httpClient).then(() => {
          window.location = '/';
        });
      }
    });
};

// Callback that is being called once userAccountEdit is successfully submit.
userAccountEdit.formSuccessProcessor = ({detail: {formId, requestPayload, responsePayload}}) => {
  // If forms saved successfully and they have success messages, show them.
  document.querySelector('#userAccountEdit .formSuccess').style.display = 'block';
};

// Init user current page.
userAccountEdit.init = () => {
  // Preload data for the current page.
  userAccountEdit.preloadData();

  // Subscribe to form events.
  document.addEventListener('userAccountEditFormSuccess', userAccountEdit.formSuccessProcessor);
};

// Call the init processes after the window loads
window.addEventListener('load', userAccountEdit.init);
