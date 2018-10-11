// Create form processor container.
const formProcessor = {};

// Bind the forms.
formProcessor.bindForms = (httpClient) => {
  if (!document.querySelector('form')) {
    // There is nothing to bind to.
    return false;
  }

  // Get all forms.
  const allForms = document.querySelectorAll('form');
  for (let formIndex = 0; formIndex < allForms.length; formIndex++) {
    allForms[formIndex].addEventListener('submit', (event) => {
      // Stop it from submitting.
      event.preventDefault();

      // Get form element.
      const form = event.target;

      // Get form info.
      const formId = form.id;
      const path = form.action;
      let method = form.method.toUpperCase();

      // Hide the error message (if it's currently shown due to a previous error).
      document.querySelector(`#${formId} .formError`).style.display = 'none';

      // Hide the success message (if it's currently shown due to a previous error).
      if (document.querySelector(`#${formId} .formSuccess`)) {
        document.querySelector(`#${formId} .formSuccess`).style.display = 'none';
      }

      // Turn the inputs into a payload.
      const payload = {};
      form.querySelectorAll('input').forEach((element) => {
        // Override the method of the form if the input's name is _method.
        if (element.name === '_method') {
          method = element.value.toUpperCase();
        } else if (element.type !== 'submit') {
          let nameOfElement = element.name;
          // Get element value depending on its type.
          let valueOfElement = element.type === 'checkbox' ? element.checked : element.value;
          // Convert strings to numbers if is required.
          if (element.classList.contains('number')) {
            valueOfElement = parseInt(valueOfElement);
          }
          payload[nameOfElement] = valueOfElement;
        }
      });

      // If the method is DELETE, the payload should be a queryStringObject instead.
      const queryStringObject = method === 'DELETE' ? payload : {};

      // Call the API.
      httpClient.request({path, method, queryStringObject, payload})
        .then(({statusCode, responsePayload}) => {
          switch (statusCode) {
            case 200:
              // If successful, send to form response processor.
              formProcessor.formResponseProcessor(formId, payload, responsePayload);
              break;

            default:
              // Try to get the error from the api, or set a default error message.
              const error = typeof(responsePayload.error) === 'string'
                ? responsePayload.error
                : 'An error has occured, please try again';

              // Set the formError field with the error text.
              document.querySelector(`#${formId} .formError`).innerHTML = error;
              document.querySelector(`#${formId} .formError`).style.display = 'block';
          }
        });
    });
  }
};

// Form response processor.
formProcessor.formResponseProcessor = (formId, requestPayload, responsePayload) => {
  // Dispatch the event.
  const formSuccessEvent = new CustomEvent(
    `${formId}FormSuccess`,
    {detail: {formId, requestPayload, responsePayload}},
  );
  document.dispatchEvent(formSuccessEvent);
};
