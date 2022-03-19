const { Service } = require('feathers-sequelize');

exports.Desks = class Desks extends Service {
    async get(id, params) {
        const data = await super.get(id, params);
        data.photo = `/cdn/desks/${id}/photo`;
        return data;
    }

    async find(params) {
        const collection = await super.find(params);
        collection.data.forEach((d, i) => {
            collection.data[i].photo = `/cdn/desks/${d.id}/photo`;
            if (collection.data[i].jobs) {
                collection.data[i].jobs.forEach((j, k) => {
                    collection.data[i].jobs[k].dataValues.file = `/cdn/jobs/${j.id}/file`
                });
            }
        });
        return collection;
    }

    async create(data, params) {
        const date = new Date();
        data.date = date;
        data.photo = Buffer.from(data.photo, 'base64');
        data.check_in = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        data.user_id = params.user.id;
        return await super.create(data, params);
    }

    async patch(id, data, params) {
        const date = new Date();
        if (data.check_out == true)
            data.check_out = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return await super.patch(id, data, params);
    }
};
