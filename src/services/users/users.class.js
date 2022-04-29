const { Service } = require('feathers-sequelize');
const { NotAcceptable } = require('@feathersjs/errors');
const bcrypt = require('bcryptjs');

exports.Users = class Users extends Service {
    constructor(options, app) {
        super(options, app);
        this.app = app;
    }
    async create(data, params) {
        return await super.create(data, params);
    }
    async get(id, params) {
        const sequelize = this.app.get('sequelizeClient');
        params.sequelize = {
            include: [{
                model: sequelize.models.departments
            }],
            raw: false
        };
        const result = await super.get(id, params);
        if (params.provider)
            result.avatar = `/cdn/users/${id}/avatar`;
        return result;
    }
    async find(params) {
        const collection = await super.find(params);
        collection.data.forEach((d, i) => {
            collection.data[i].avatar = `/cdn/users/${d.id}/avatar`;
        });
        return collection;
    }
    async patch(id, data, params) {
        const user = await super.get(id);
        if (user.type !== 'administrator')
            if (user.id !== id) throw new NotAcceptable('You are not allowed to edit another user');
        if (data.old_password) {
            if (!bcrypt.compareSync(data.old_password, user.password)) throw new NotAcceptable('Password mismatch');
            delete data.old_password;
        }
        if (data.avatar)
            data.avatar = Buffer.from(data.avatar, 'base64');
        return await super.patch(id, data, params);
    }
};
