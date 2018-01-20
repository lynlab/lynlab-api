'use strict';

function generateResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ result: body })
  }
}

exports.handle = function (event, context, callback) {
  if (event.path === '/ping') {
    callback(null, generateResponse(200, 'pong'));
  } else {
    callback(null, generateResponse(404, { message: 'Not found' }));
  }
}
