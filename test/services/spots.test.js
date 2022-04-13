const assert = require('assert');
const app = require('../../src/app');

describe('\'spots\' service', () => {
  it('registered the service', () => {
    const service = app.service('spots');

    assert.ok(service, 'Registered the service');
  });
});
