/* eslint-disable import/no-unresolved */

const router = require('./lib/router');
const auth = require('./auth');

const routeMap = {
  '/ping': {
    GET: () => new Promise(resolve => resolve('pong')),
  },
  '/v1': {
    '/auth': auth.routeMap,
  },
};

const handle = (event, context, callback) => new Promise((resolve, reject) => {
  try {
    resolve(router.route(routeMap, event.path, event.httpMethod));
  } catch (e) {
    callback(null, { statusCode: 404 })
  }
}).then((control) => {
  return control(event, context);
}).then((result) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ result }),
  });
}).catch((e) => {
  console.error(e, e.stack);
  callback(null, { statusCode: 500 });
});

exports.handle = handle;
