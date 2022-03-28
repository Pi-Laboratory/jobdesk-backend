const { Service } = require('feathers-sequelize');
const md5 = require('md5');

exports.Jobs = class Jobs extends Service {
    constructor(options, app) {
        super(options, app);
        this.app = app;
    }

    async get(id, params) {
        const data = await super.get(id, params);
        if (params.provider)
            data.file = `/cdn/jobs/${id}/file`;
        return data;
    }

    async find(params) {
        const collection = await super.find(params);
        collection.data.forEach((d, i) => {
            collection.data[i].dataValues.file = `/cdn/jobs/${d.id}/file`;
            collection.data[i].dataValues.code = generateCode(collection.data[i].id);
            // console.log(collection.data[i].code);
        });
        return collection;
    }

    async create(data) {
        data.file = Buffer.from(data.file, 'base64');
        const job = await super.create(data);
        if (data.references) {
            if (data.references.length) {
                for (let i = 0; i < data.references.length; i++) {
                    await this.app.service('references').create({
                        source_id: job.id,
                        refer_id: data.references[i]
                    });
                }
            }
        }
        return job;
    }
};

function generateCode(val) {
    return md5(val).substring(0, 7);
}