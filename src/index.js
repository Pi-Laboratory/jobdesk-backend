/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);
const moment = require('moment');

process.on('unhandledRejection', (reason, p) => {
  console.log(reason, p);
  logger.error('Unhandled Rejection at: Promise ')
});

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
      runAutoAbsence(app);
      runNotifier(app);
    } catch (e) {
      console.log(e);
    }
  });
});

async function runAutoAbsence(app) {
  let skip = false;
  let previousDate = moment();
  let schedule = (await app.service('schedules').find({
    query: {
      day: moment().weekday(),
      $limit: 1
    }
  })).data[0];
  const sequelize = app.get('sequelizeClient');

  while (true) {
    await sleep(5000);
    const now = moment();
    if (now.diff(previousDate, 'days') === 0) {
      if (skip) {
        previousDate = now;
        continue;
      }
      if (schedule) {
        if (now.diff(moment(schedule.close_time, [moment.ISO_8601, 'HH:mm:ss']), 'minutes') > 0) {
          const users = await sequelize.models.users.findAll({
            attributes: ['id'],
            include: [{
              required: false,
              model: sequelize.models.desks,
              where: {
                date: now
              }
            }]
          });
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (!user.desks.length) {
              await app.service('desks').create({
                mode: 'absent',
                user_id: user.id
              });
            }
          }
          skip = true;
        }
      } else {
        console.log('Auto create off desks...');
        const users = await this.app.service('users').find({
          provider: 'internal',
          $select: ['id'],
          $include: [{
            model: 'desks',
            $where: {
              date: now
            }
          }]
        });
        for (let i = 0; i < users.data.length; i++) {
          const user = users[i];
          await this.app.service('desks').create({
            mode: 'off',
            user_id: user.id
          });
        }
        skip = true;
      }
      previousDate = now;
    } else {
      skip = false;
      previousDate = now;
      schedule = (await app.service('schedules').find({
        query: {
          day: now.weekday(),
          $limit: 1
        }
      })).data[0];
    }
  }
}

async function runNotifier(app) {
  let skipStart = false;
  let skipFinish = false;
  let previousDate = moment();
  let schedule = (await app.service('schedules').find({
    query: {
      day: previousDate.weekday(),
      $limit: 1
    }
  })).data[0];
  const messaging = app.get('fcm');

  while (true) {
    await sleep(5000);
    const now = moment();
    if (now.diff(previousDate, 'days') === 0) {
      if (schedule) {
        const open = moment(schedule.open_time, [moment.ISO_8601, 'HH:mm:ss']);
        if (now.diff(open, 'minutes') >= 0) {
          if (!skipStart) {
            const startMessage = {
              notification: {
                title: 'Waktu check-in sudah dekat',
                body: `Segera lakukan check-in. Anda akan tercatat terlambat dalam ${schedule.tolerance} menit`
              },
              condition: `'unchecked' in topics`
            }
            try {
              console.log('Sending open notification...');
              const response = await messaging.send(startMessage);
              skipStart = true;
              console.log(response);
            } catch (e) { console.log(e) };
          }
        }

        const close = moment(schedule.close_time, [moment.ISO_8601, 'HH:mm:ss']);
        if (now.diff(close, 'minutes') >= 0) {
          if (!skipFinish) {
            const finishMessage = {
              notification: {
                title: 'Waktu check-out sudah dekat',
                body: 'Jangan lupa lakukan check-out hari ini!'
              },
              condition: `'checked' in topics`
            }
            try {
              console.log('Sending close notification...');
              const response = await messaging.send(finishMessage);
              skipFinish = true;
              console.log(response);
            } catch (e) { console.log(e) };
          }
        }
      }
      previousDate = now;
    } else {
      skipStart = false;
      skipFinish = false;
      previousDate = now;
      schedule = (await app.service('schedules').find({
        query: {
          day: now.weekday(),
          $limit: 1
        }
      })).data[0];
    }
  }
}

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));