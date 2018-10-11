// Create module container.
const auth = {};

// Set up token key.
auth.tokenKey = 'token';

// Get the session token from local storage.
auth.getToken = () => {
  const tokenString = localStorage.getItem(auth.tokenKey);
  if (typeof tokenString !== 'string') {
    return false;
  }

  try {
    const token = JSON.parse(tokenString);
    return typeof token === 'object' ? token : false;
  } catch (error) {
    return false;
  }
};

// Set the session token to local storage.
auth.setToken = (token) => {
  const tokenString = JSON.stringify(token);
  localStorage.setItem(auth.tokenKey, tokenString);
};

// Log the user out then redirect them.
auth.logUserOut = (httpClient) => {
  return new Promise((resolve, reject) => {
    // Get the current token id
    const token = auth.getToken();
    const tokenId = token && typeof token.id === 'string' ? token.id : false;

    // Send the current token to the tokens endpoint to delete it.
    const queryStringObject = {id: tokenId};
    const path = '/api/tokens';
    const method = 'DELETE';
    httpClient.request({path, method, queryStringObject})
      .then(({statusCode, responsePayload}) => {
        // Set the app.config token as false.
        auth.setToken(false);
        resolve(true);
      })
      .catch(error => reject(error));
  });
};
