const crypto = require('crypto');
const squareConnect = require('square-connect');

exports.handler = function(context, event, callback) {
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
      amount: 100, // $1.00 charge
      currency: 'USD'
    },
    idempotency_key: idempotency_key
  };

  try {
    const response = payments_api.createPayment(request_body);
    // callback.status(200).json({
    callback(null, {
      'title': 'Payment Successful',
      'result': response
    });
  } catch(error) {
    // callback.status(500).json({
    callback(err, {
      'title': 'Payment Failure',
      'result': error.response.text
    });
  }
};