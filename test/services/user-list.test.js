const assert = require('assert');
const app = require('../../src/app');

describe('\'user-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-list');

    assert.ok(service, 'Registered the service');
  });
});
