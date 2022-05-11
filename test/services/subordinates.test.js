const assert = require('assert');
const app = require('../../src/app');

describe('\'subordinates\' service', () => {
  it('registered the service', () => {
    const service = app.service('subordinates');

    assert.ok(service, 'Registered the service');
  });
});
