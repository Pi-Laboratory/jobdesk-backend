/* eslint-disable no-unused-vars */
exports.Reports = class Reports {
  constructor(options, app) {
    this.app = app;
    this.options = options || {};
  }

  async find(params) {
    const { month, department_id, $limit = 200, $skip = 0 } = params.query;
    const sequelize = this.app.get('sequelizeClient');
    console.log($limit, $skip);
    const data = await sequelize.models.users.findAndCountAll({
      attributes: ['id', 'full_name', 'role'],
      where: { department_id },
      include: [{
        required: false,
        attributes: ['mode', 'date', 'check_in', 'check_in_delay', 'check_out', 'check_out_delay'],
        model: sequelize.models.desks,
        where: sequelize.where(sequelize.fn('DATE_PART', 'month', sequelize.col('date')), month)
      }],
      limit: $limit, offset: $skip,
      order: [['full_name', 'asc']]
    });
    return data;
  }
};
