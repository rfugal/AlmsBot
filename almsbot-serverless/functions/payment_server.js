const crypto = require('crypto');
const squareConnect = require('square-connect');

exports.handler = function(context, event, callback) {
  const SERVICE_SID = context.SYNC_SERVICE_SID;
  const PAYMENT_ID_MAP = context.PAYMENT_ID_MAP;
  // Set the Access Token
  const accessToken = context.SQUARE_ACCESS_TOKEN;
  // Set Square Connect credentials and environment
  const defaultClient = squareConnect.ApiClient.instance;
  
  // Configure OAuth2 access token for authorization: oauth2
  const oauth2 = defaultClient.authentications['oauth2'];
  oauth2.accessToken = accessToken;
  
  // Set 'basePath' to switch between sandbox env and production env
  // sandbox: https://connect.squareupsandbox.com
  // production: https://connect.squareup.com
  defaultClient.basePath = 'https://connect.squareupsandbox.com';

  // length of idempotency_key should be less than 45
  const idempotency_key = crypto.randomBytes(22).toString('hex');

  // Charge the customer's card
  const payments_api = new squareConnect.PaymentsApi();
  const request_body = {
    source_id: event.nonce,
    amount_money: {
      amount: parseInt(event.amount),
      currency: 'USD'
    },
    idempotency_key: idempotency_key
  };
  let donor = event.donor;
  donor.data.paid = true;

  payments_api.createPayment(request_body)
    .then( function(response) {
      if (response.payment.status == "COMPLETED") {
        responseObject = {
          'title': 'Payment Successful',
          'result': response,
          'amount': event.amount
        }
        const twilioClient = context.getTwilioClient();
        twilioClient.sync.services(SERVICE_SID)
        .syncMaps(PAYMENT_ID_MAP).syncMapItems
        .get(donor.key).update({
          data: donor.data,
          ttl: 0
        }).then(response => {
          responseObject.update_response = response;
          callback(null, responseObject);
        });      
      } else {
        callback(null, {
          'title': 'Payment Failed',
          'result': response,
          'amount': event.amount
        });
      }
    })
    .catch( function(error) {
      callback(null, {
        'title': 'Payment Failed',
        'result': error,
        'amount': event.amount
      });
    });
};