function makeResponse(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify({ result: body }),
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
  }
}

module.exports = {};
module.exports.makeResponse = makeResponse;
