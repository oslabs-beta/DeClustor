// awsConfig.js
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-southeast-2', // e.g., 'us-west-2'
});

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports = cognito;
