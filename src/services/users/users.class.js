const { Service } = require('feathers-sequelize');

exports.Users = class Users extends Service {
    constructor(options, app) {
        super(options, app);
        this.app = app;
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
};
