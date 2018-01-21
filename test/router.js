const chai = require('chai');
const router = require('../lib/router');

const testRouteMap = {
  GET: (event, context) => 'GET /',
  '/tests': {
    GET: (event, context) => 'GET /tests',
    POST: (event, context) => 'POST /tests',
    '/details': {
      PUT: (event, context) => 'PUT /tests/details',
    },
  },
};

describe('Route', () => {
  it('Success case', () => {
    chai.expect(router.route(testRouteMap, '/', 'GET')()).to.equal('GET /');
    chai.expect(router.route(testRouteMap, '/tests', 'POST')()).to.equal('POST /tests');
    chai.expect(router.route(testRouteMap, '/tests/', 'GET')()).to.equal('GET /tests');
    chai.expect(router.route(testRouteMap, '/tests/details', 'PUT')()).to.equal('PUT /tests/details');
  });

  it('NotFound case', () => {
    chai.expect(() => router.route(testRouteMap, '/test', 'GET')()).to.throw();
    chai.expect(() => router.route(testRouteMap, '/tests', 'DELETE')()).to.throw();
  });
});
