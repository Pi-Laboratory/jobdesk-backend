const parseQuery = require('./hooks/parse-query');
// Application hooks that run for every service

module.exports = {
  before: {
    all: [],
    find: [parseQuery()],
    get: [parseQuery()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
