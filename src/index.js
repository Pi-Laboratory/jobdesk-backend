/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () => {
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port);
  app.configure(async (app) => {
    try {
      const config = (await app.service('configs').find()).data[0];
      if (!config) {
        await app.service('configs').create({
          app_name: 'JobDesk'
        });
      }
      const schedules = (await app.service('schedules').find()).data;
      if (schedules.length < 5) {
        const models = app.get('sequelizeClient').models;
        await models.schedules.destroy({ truncate: true });
        for (let day = 1; day <= 5; day++) {
          await app.service('schedules').create({
            day: day,
            open_time: '07:45:00',
            break_time_start: '12:00:00',
            break_time_stop: '13:00:00',
            close_time: day != 5 ? '16:45:00' : '13:00:00',
            tolerance: 15
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
});

async function checkAbsence(app) {
  let skip = false;
  let previousDate = moment();

  while (true) {
    const now = moment();
    if (now.diff(previousDate, 'days') === 0) {
      if (skip) continue;
      const schedule = (await app.service('schedules').find({
        query: {
          day: now.weekday(),
          $limit: 1
        }
      })).data[0];
      if (schedule) {
        if (now.diff(moment(`${schedule.date} ${schedule.close_time}`), 'minutes') > 0) {
          // auto create desk absence
          const users = await this.app.service('users').find({
            provider: 'internal',
            $include: [{
              model: 'desks',
              $required: true,
              $where: {
                date: now
              }
            }]
          });
          for (let i = 0; i < users.data.length; i++) {
            
          }
          skip = true;
          previousDate = now;
        } else {
          skip = false;
          previousDate = now;
        }
        continue;
      } else {
      }
    } else {
    }
  }


}