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
        return result;
    }
    async patch(id, data, params) {
        const user = await super.get(id);
        if (user.type !== 'administrator')
            if (user.id !== id) throw new NotAcceptable('You are not allowed to edit another user');
        if (data.old_password) {
            if (!bcrypt.compareSync(data.old_password, user.password)) throw new NotAcceptable('Password mismatch');
            delete data.old_password;
        }
        return await super.patch(id, data, params);
    }
};
