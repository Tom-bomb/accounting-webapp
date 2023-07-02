// read env vars from .env file
require('dotenv').config();
const { Configuration, PlaidApi, Products, PlaidEnvironments} = require('plaid');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors');
var fs = require("fs");



const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(
  ',',
);

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
// The payment_id is only relevant for the UK/EU Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store along with the Payment metadata, such as userId .
let PAYMENT_ID = null;
// The transfer_id is only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
let TRANSFER_ID = null;

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.use(cors());

app.use('/api', function (error, request, response, next) {
   prettyPrintResponse(error.response);
   response.json(formatError(error.response));
 });

const prettyPrintResponse = (response) => {
   console.log(util.inspect(response.data, { colors: true, depth: 4 }));
 };


// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
app.get('/api/transactions', function (request, response, next) {
   Promise.resolve()
     .then(async function () {
       // Set cursor to empty to receive all historical updates
       let cursor = null;
 
       // New transaction updates since "cursor"
       let added = [];
       let modified = [];
       // Removed transaction ids
       let removed = [];
       let hasMore = true;
       // Iterate through each page of new transaction updates for item
       while (hasMore) {
         const request = {
           access_token: ACCESS_TOKEN,
           cursor: cursor,
         };
         const response = await client.transactionsSync(request)
         const data = response.data;
         // Add this page of results
         added = added.concat(data.added);
         modified = modified.concat(data.modified);
         removed = removed.concat(data.removed);
         hasMore = data.has_more;
         // Update cursor to the next cursor
         cursor = data.next_cursor;
         prettyPrintResponse(response);
       }
 
       const compareTxnsByDateAscending = (a, b) => (a.date > b.date) - (a.date < b.date);
       // Return the 8 most recent transactions
       const recently_added = [...added].sort(compareTxnsByDateAscending).slice(-8);
       response.json({latest_transactions: recently_added});
     })
     .catch(next);
 });








// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
app.post('/api/set_access_token', function (request, response, next) {
   PUBLIC_TOKEN = request.body.public_token;
   Promise.resolve()
     .then(async function () {
       const tokenResponse = await client.itemPublicTokenExchange({
         public_token: PUBLIC_TOKEN,
       });
       prettyPrintResponse(tokenResponse);
       ACCESS_TOKEN = tokenResponse.data.access_token;
       ITEM_ID = tokenResponse.data.item_id;
       if (PLAID_PRODUCTS.includes(Products.Transfer)) {
         TRANSFER_ID = await authorizeAndCreateTransfer(ACCESS_TOKEN);
       }
       response.json({
         // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
         access_token: ACCESS_TOKEN,
         item_id: ITEM_ID,
         error: null,
       });
     })
     .catch(next);
 });



// This is a helper function to authorize and create a Transfer after successful
// exchange of a public_token for an access_token. The TRANSFER_ID is then used
// to obtain the data about that particular Transfer.

const authorizeAndCreateTransfer = async (accessToken) => {
   // We call /accounts/get to obtain first account_id - in production,
   // account_id's should be persisted in a data store and retrieved
   // from there.
   const accountsResponse = await client.accountsGet({
     access_token: accessToken,
   });
   const accountId = accountsResponse.data.accounts[0].account_id;
 
   const transferAuthorizationResponse =
     await client.transferAuthorizationCreate({
       access_token: accessToken,
       account_id: accountId,
       type: 'credit',
       network: 'ach',
       amount: '1.34',
       ach_class: 'ppd',
       user: {
         legal_name: 'FirstName LastName',
         email_address: 'foobar@email.com',
         address: {
           street: '123 Main St.',
           city: 'San Francisco',
           region: 'CA',
           postal_code: '94053',
           country: 'US',
         },
       },
     });
   prettyPrintResponse(transferAuthorizationResponse);
   const authorizationId = transferAuthorizationResponse.data.authorization.id;
 
   const transferResponse = await client.transferCreate({
     access_token: accessToken,
     account_id: accountId,
     authorization_id: authorizationId,
     description: 'Payment',
   });
   prettyPrintResponse(transferResponse);
   return transferResponse.data.transfer.id;
 };







app.get('/transactions', function (req, res) {
   fs.readFile( __dirname + "/" + "transactions.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening at http://%s:%s", host, port)
})