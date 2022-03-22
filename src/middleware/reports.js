module.exports = (app) => {
  return async function reports(req, res, next) {
    if (!req.user) res.status(401).data({ message: 'Unauthorized' });
    const sequelizeClient = app.get('sequelizeClient');
    const activities = await app.service('desks').find({
      sequelize: {
        raw: false,
        include: [{
          model: sequelizeClient.models.jobs,
          raw: false
        }]
      }
    });
    console.log(activities);
    res.send('OK');
  };
};
