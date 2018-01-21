/* eslint-disable import/no-unresolved */

const crypto = require('crypto');

const dynamodb = require('./lib/dynamodb-promise');

// Auth existing user.
// Body params:
//   - username
//   - serviceName
//   - password
function auth(event, context) {
  const body = JSON.parse(event.body);
  const params = {
    TableName: 'LYnLabAPIAuths',
    Key: { Username: { S: body.username } },
  };

  return dynamodb.getItem(params).then(data => new Promise((resolve) => {
    if (data.Item) {
      const passwordHash = crypto.createHash('sha256').update(body.password + data.Item.Salt.S).digest('base64');
      resolve(passwordHash === data.Item.Password.S);
    } else {
      resolve(false);
    }
  }));
}

// Register new user.
// Body params:
//   - username
//   - serviceName
//   - password
function register(event, context) {
  const body = JSON.parse(event.body);

  const salt = crypto.randomBytes(12).toString('base64');
  const passwordHash = crypto.createHash('sha256').update(body.password + salt).digest('base64');
  const params = {
    TableName: 'LYnLabAPIAuths',
    Item: {
      Username: { S: body.username },
      Password: { S: passwordHash },
      Salt: { S: salt },
    },
  };

  return dynamodb.putItem(params);
}

const routeMap = {
  POST: auth,
  '/register': { POST: register },
};

module.exports = {};
module.exports.routeMap = routeMap;
