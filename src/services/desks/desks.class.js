const { Service } = require('feathers-sequelize');
const { NotAcceptable } = require('@feathersjs/errors');
const moment = require('moment');
const md5 = require('md5');
exports.Desks = class Desks extends Service {

    constructor(options, app) {
        super(options, app);
        this.app = app;
    }

    async get(id, params) {
        const data = await super.get(id, params);
        if (params.provider) {
            data.check_in_photo = `/cdn/desks/${id}/check_in_photo`;
            data.check_out_photo = `/cdn/desks/${id}/check_out_photo`;
        }
        return data;
    }

    async find(params) {
        const collection = await super.find(params);
        collection.data.forEach((d, i) => {
            collection.data[i].check_in_photo = `/cdn/desks/${d.id}/check_in_photo`;
            collection.data[i].check_out_photo = `/cdn/desks/${d.id}/check_out_photo`;
            collection.data[i].check_in_on_time = collection.data[i].check_in_delay <= 0;
            if (collection.data[i].jobs) {
                collection.data[i].jobs.forEach((j, k) => {
                    collection.data[i].jobs[k].dataValues.file = `/cdn/jobs/${j.id}/file`;
                    collection.data[i].jobs[k].dataValues.code = generateCode(j.id);
                    if (collection.data[i].jobs[k].references) {
                        collection.data[i].jobs[k].references.forEach((r, l) => {
                            collection.data[i].jobs[k].references[l].dataValues.code = generateCode(r.refer_id);
                        });
                    }
                });
            }
        });
        return collection;
    }

    async create(data, params) {
        const date = moment();
        data.date = date;
        if(['wfo', 'wfh', 'trip'].indexOf(data.mode) === -1) return await super.create(data, params);
        const schedule = (await this.app.service('schedules').find({
            query: {
                day: date.day()
            }
        })).data[0];
        if (!schedule) throw new NotAcceptable('Schedule on this day has not been set yet!');

        const check_in_time = moment(schedule.open_time, [moment.ISO_8601, 'HH:mm:ss']);
        check_in_time.add(schedule.tolerance, 'minutes');
        const delay = (moment.duration(date.diff(check_in_time))).asMinutes();
        data.check_in_delay = delay;

        data.check_in_photo = Buffer.from(data.check_in_photo, 'base64');
        data.check_in = date.format('HH:mm:ss');
        data.user_id = params.user.id;
        return await super.create(data, params);
    }

    async patch(id, data, params) {
        if (data.check_out == true) {
            const date = moment();
            const schedule = (await this.app.service('schedules').find({
                query: {
                    day: date.day()
                }
            })).data[0];
            if (!schedule) throw new NotAcceptable('Schedule on this day has not been set yet!');

            const check_out_time = moment(schedule.close_time, [moment.ISO_8601, 'HH:mm:ss']);
            check_out_time.add(schedule.tolerance, 'minutes');
            const delay = (moment.duration(date.diff(check_out_time))).asMinutes();
            data.check_out_delay = delay;
            data.check_out_photo = Buffer.from(data.check_out_photo, 'base64');
            data.check_out = date.format('HH:mm:ss');
        }
        return await super.patch(id, data, params);
    }
};

function generateCode(val) {
    return md5(val).substring(0, 7);
}