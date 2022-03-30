const assert = require('assert');
const app = require('../../src/app');

describe('\'recaps\' service', () => {
  it('registered the service', () => {
    const service = app.service('recaps');

    assert.ok(service, 'Registered the service');
  });
});
