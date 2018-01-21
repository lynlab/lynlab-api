/* eslint-disable no-eval */

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();

const methods = ['getItem', 'putItem'];

module.exports = {};
(() => {
  methods.forEach((method) => {
    eval(`
      module.exports.${method} = (params) => {
        return new Promise((resolve, reject) => {
          dynamodb.${method}(params, (e, data) => {
            if (e) {
              reject(e);
            } else {
              resolve(data);
            }
          });
        });
      }
    `);
  });
})();
