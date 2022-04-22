const app = require('../app');
const moment = require('moment');

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

app.setup();

app.get('sequelizeSync').then(async () => {
    const sequelize = app.get('sequelizeClient');
    console.log('Auto-absent is running');
    while (true) {
        await sleep(5000);
        const now = moment();
        const schedule = (await app.service('schedules').find({
            query: {
                day: now.weekday(),
                $limit: 1
            }
        })).data[0];

        if (schedule) {
            if (now.diff(moment(schedule.close_time, [moment.ISO_8601, 'HH:mm:ss']), 'minutes') > 0) {
                const users = await sequelize.models.users.findAll({
                    attributes: ['id'],
                    include: [{
                        required: false,
                        model: sequelize.models.desks,
                        where: {
                            date: now.toDate()
                        }
                    }]
                });
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    if (!user.desks.length) {
                        await app.service('desks').create({
                            mode: 'absent',
                            user_id: user.id
                        });
                    }
                }
            }
        } else {
            console.log('Auto create off desks...');
            const users = await sequelize.models.users.findAll({
                attributes: ['id'],
                include: [{
                    required: false,
                    model: sequelize.models.desks,
                    where: {
                        date: now.toDate()
                    }
                }]
            });
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                await app.service('desks').create({
                    mode: 'off',
                    user_id: user.id
                });
            }
        }
    }
});