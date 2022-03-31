const moment = require('moment');

/* eslint-disable no-unused-vars */
exports.Recaps = class Recaps {
  constructor(options, app) {
    this.app = app;
    this.options = options || {};
  }

  async find(params) {
    console.log(params);
    const result = [];

    for (let i = 0; i < 3; i++) {
      const start = moment().subtract(i, 'month').startOf('month');
      const end = moment().subtract(i, 'month').endOf('month');
      const desks = await this.app.service('desks').find({
        provider: 'internal',
        authentication: params.authentication,
        query: {
          $select: ['id', 'mode', 'check_in_photo', 'check_in_delay'],
          user_id: params.user.id,
          date: {
            $gte: start.toDate(),
            $lte: end.toDate()
          },
          $include: [{
            model: 'jobs',
            $where: {
              file_mime: {
                $in: ['image/jpg', 'image/jpeg', 'image/png']
              }
            }
          }]
        }
      });
      if (!desks.data.length) continue;
      const recap = {
        month: start.format('M'),
        total_absent: desks.data.filter((d) => d.mode === 'absent').length,
        total_sick: desks.data.filter((d) => d.mode === 'sick').length,
        total_wfo: desks.data.filter((d) => d.mode === 'wfo').length,
        total_wfh: desks.data.filter((d) => d.mode === 'wfh').length,
        total_trip: desks.data.filter((d) => d.mode === 'trip').length,
        jobs: (() => {
          const jobs = [];
          for (let i = 0; i < desks.data.length; i++) {
            console.log(desks.data[i].jobs);
            for (let j = 0; j < desks.data[i].jobs.length; j++) {
              console.log('push jobs');
              jobs.push(desks.data[i].jobs[j]);
            }
            if (jobs.length >= 4) break;
          }
          // console.log(jobs);
          return jobs;
        })()
      }
      result.push(recap);
    }

    return result;
  }
};
