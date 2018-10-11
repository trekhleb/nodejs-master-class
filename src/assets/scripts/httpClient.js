// Create module container.
const httpClient = {};

// HTTP clients defaults.
httpClient.defaults = {
  headers: {},
};

// Interface for making API calls.
httpClient.request = async ({
  headers = {},
  path = '/',
  method = 'GET',
  queryStringObject = {},
  payload = {},
}) => {
  // Promisify request function.
  return new Promise((resolve, reject) => {
    // For each query string parameter sent, add it to the path.
    let requestUrl = `${path}?`;
    let counter = 0;
    for (let queryKey in queryStringObject){
      if(queryStringObject.hasOwnProperty(queryKey)){
        counter++;

        // If at least one query string parameter has already been added, preprend new ones with an ampersand.
        if (counter > 1){
          requestUrl += '&';
        }

        // Add the key and value
        requestUrl += `${queryKey}=${queryStringObject[queryKey]}`;
      }
    }

    // Form the http request as a JSON type.
    const xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    // For each header sent, add it to the request.
    headers = Object.assign(httpClient.defaults.headers, headers);
    for(let headerKey in headers){
      if (headers.hasOwnProperty(headerKey)) {
        xhr.setRequestHeader(headerKey, headers[headerKey]);
      }
    }

    // When the request comes back, handle the response
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const statusCode = xhr.status;
        const responseReturned = xhr.responseText;

        try {
          const parsedResponse = JSON.parse(responseReturned);
          resolve({statusCode, responsePayload: parsedResponse});
        } catch (error){
          reject(error);
        }
      }
    };

    // Send the payload as JSON.
    const payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
  });
};
