const users = require('./users/users.service.js');
const departments = require('./departments/departments.service.js');
const configs = require('./configs/configs.service.js');
const desks = require('./desks/desks.service.js');
const jobs = require('./jobs/jobs.service.js');
const schedules = require('./schedules/schedules.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(departments);
  app.configure(configs);
  app.configure(desks);
  app.configure(jobs);
  app.configure(schedules);
};
