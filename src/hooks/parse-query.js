// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (!context.params.provider) return context;
    if (!context.params.query) return context;
    const sequelize = context.app.get('sequelizeClient');
    const query = context.params.query;
    const $include = query.$include ? [...query.$include] : [];
    context.params.sequelize = {
      distinct: query.$distinct,
      include: $include ? $include.map((include) => buildIncludes(include, sequelize.models)) : [],
      raw: false
    };
    delete context.params.query.$include;
    delete context.params.query.$distinct;
    return context;
  };
};

function buildIncludes(m, models) {
  if (m.model === 'users') {
    if (m.$select)
      if (m.$select.indexOf('password') !== -1)
        delete m.$select[m.$select.indexOf('password')];
  }
  const parsed = {
    as: m.$as,
    required: m.$required,
    where: m.$where,
    model: models[m.model],
    attributes: m.$select,
    include: typeof m.$include === 'object' ? m.$include.map((include) => buildIncludes(include, models)) : [],
    raw: false,
    order: ((sort) => {
      if (!sort) return;
      const fields = Object.keys(sort);
      const order = [];
      fields.forEach((f) => {
        order.push([f, sort[f] == 1 ? 'asc' : 'desc']);
      });
      return order;
    })(m.$sort)
  };
  return parsed;
}
