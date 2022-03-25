const { Service } = require('feathers-sequelize');

exports.Jobs = class Jobs extends Service {
    async get(id, params) {
        const data = await super.get(id, params);
        if (params.provider)
            data.file = `/cdn/jobs/${id}/file`;
        return data;
    }

    async find(params) {
        const collection = await super.find(params);
        collection.data.forEach((d, i) => {
            collection.data[i].file = `/cdn/jobs/${d.id}/file`;
        });
        return collection;
    }

    async create(data) {
        data.file = Buffer.from(data.file, 'base64');
        return super.create(data);
    }
};
