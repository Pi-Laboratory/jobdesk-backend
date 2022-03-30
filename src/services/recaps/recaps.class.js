const moment = require('moment');

/* eslint-disable no-unused-vars */
exports.Recaps = class Recaps {
  constructor(options, app) {
    this.app = app;
    this.options = options || {};
  }

  async find(params) {
    const result = [];

    for (let i = 0; i < 2; i++) {
      const start = moment().subtract(i, 'month').startOf('month');
      const end = moment().subtract(i, 'month').endOf('month');
      const desks = await this.app.service('desks').find({
        query: {
          $select: ['id', 'check_in_photo', 'check_in_delay'],
          date: {
            $gte: start.toDate(),
            $lte: end.toDate()
          }
        }
      });
      const totalWorkDay = 0;
      const totalCheckInDay = 0;
      for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      }
    }

    const recaps = await this.app.service('desks').find({
      query: {
        $limit: 3,
        $sort: {
          created_at: -1
        }
      }
    });

    return [];
  }
};
