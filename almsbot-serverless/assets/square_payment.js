const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let full_amount = (urlParams.has('amount')
                   && !isNaN(urlParams.get('amount'))) ? parseInt(urlParams.get('amount')) : 2000;
let submit_btn = document.getElementById('sq-creditcard');
let message_text = document.getElementById('message-text');
submit_btn.innerText = `Donate $${(full_amount*0.01).toFixed(2)}`;
if (urlParams.has('user')) {
  fetch('./map_user_payment', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'user': urlParams.get('user')})
  })
  .catch(err => {
    alert('Network error: ' + err);
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(errorInfo => Promise.reject(errorInfo)); //UPDATE HERE
    }
    return response.json(); //UPDATE HERE
  })
  .then(item => {
    if (item.data.hasOwnProperty('full_amount')) {
      full_amount = item.data.full_amount;
      submit_btn.innerText = `Donate $${(full_amount*0.01).toFixed(2)}`;
    }
    if (item.data.hasOwnProperty('message')) {
      message_text.innerText = item.data.message;
    }
  })
  .catch(err => {
    console.log(err);
  });
}
// Create and initialize a payment form object
const paymentForm = new SqPaymentForm({
    // Initialize the payment form elements
    
    //TODO: Replace with your sandbox application ID
    applicationId: "sandbox-sq0idb-_zaASEJYgdS2Bq-nKIMc6Q",
    locationId: "LGW9ZJQSZBAQP",
    inputClass: 'sq-input',
    autoBuild: false,
    // Customize the CSS for SqPaymentForm iframe elements
    inputStyles: [{
        fontSize: '16px',
        lineHeight: '24px',
        padding: '16px',
        placeholderColor: '#a0a0a0',
        backgroundColor: 'transparent',
    }],
    // Initialize Web Apple Pay placeholder ID
    applePay: {
        elementId: 'sq-apple-pay'
    },
    googlePay: {
        elementId: 'sq-google-pay'
    },
    // Initialize the credit card placeholders
    cardNumber: {
        elementId: 'sq-card-number',
        placeholder: 'Card Number'
    },
    cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
    },
    expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
    },
    postalCode: {
        elementId: 'sq-postal-code',
        placeholder: 'Postal'
    },
    // SqPaymentForm callback functions
    callbacks: {
      methodsSupported: function (methods, unsupportedReason) {
        console.log(methods);
  
        var applePayBtn = document.getElementById('sq-apple-pay');
        var googlePayBtn = document.getElementById('sq-google-pay');
  
        // Only show the button if Apple Pay on the Web is enabled
        // Otherwise, display the wallet not enabled message.
        if (methods.applePay === true) {
          applePayBtn.style.display = 'inline-block';
        } else {
          console.log(unsupportedReason);
        }
        if (methods.googlePay === true) {
          googlePayBtn.style.display = 'inline-block';
        } else {
          console.log(unsupportedReason);
        }
      },
      /*
      * callback function: cardNonceResponseReceived
      * Triggered when: SqPaymentForm completes a card nonce request
      */
      cardNonceResponseReceived: function (errors, nonce, cardData) {
        if (errors) {
            // Log errors from nonce generation to the browser developer console.
            console.error('Encountered errors:');
            errors.forEach(function (error) {
                console.error('  ' + error.message);
                alert(error.message);
            });
            return;
        }
        //TODO: Replace alert with code in step 2.1
        fetch('./payment_server', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nonce: nonce,
              amount: full_amount
            })
          })
          .catch(err => {
            alert('Network error: ' + err);
          })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorInfo => Promise.reject(errorInfo)); //UPDATE HERE
            }
            return response.json(); //UPDATE HERE
          })
          .then(data => {
            console.log(data); //UPDATE HERE
            alert(`$${(data.amount/100).toFixed(2)} ${data.title}`); // TODO: update syncMapItem
          })
          .catch(err => {
            console.error(err);
            alert('Payment failed.');
          });
      },
      createPaymentRequest: function () {
        return myCreatePaymentRequestHelperFunction();
      }
    }
});
//TODO: paste code from step 1.1.4
//TODO: paste code from step 1.1.5
paymentForm.build();
// onGetCardNonce is triggered when the "Pay $1.00" button is clicked
function onGetCardNonce(event) {
  // Don't submit the form until SqPaymentForm returns with a nonce
  event.preventDefault();
  // Request a nonce from the SqPaymentForm object
  paymentForm.requestCardNonce();
}

function myCreatePaymentRequestHelperFunction() {
  /*
  * Triggered when: a digital wallet payment button is clicked.
  */
  var paymentRequestJson = {
    requestShippingAddress: true,
    requestBillingInfo: true,
    shippingContact: {
      familyName: "CUSTOMER LAST NAME",
      givenName: "CUSTOMER FIRST NAME",
      email: "mycustomer@example.com",
      country: "USA",
      region: "CA",
      city: "San Francisco",
      addressLines: [
        "1455 Market St #600"
      ],
      postalCode: "94103",
      phone:"14255551212"
    },
    currencyCode: "USD",
    countryCode: "US",
    total: {
      label: "Text2Alms.org",
      amount: "85.00",
      pending: false
    },
    lineItems: [
      {
        label: "Subtotal",
        amount: "60.00",
        pending: false
      },
      {
        label: "Shipping",
        amount: "19.50",
        pending: true
      },
      {
        label: "Tax",
        amount: "5.50",
        pending: false
      }
    ],
    shippingOptions: [
      {
        id: "1",
        label: "SHIPPING LABEL",
        amount: "SHIPPING COST"
      }
   ]
  };
  return paymentRequestJson;
}
