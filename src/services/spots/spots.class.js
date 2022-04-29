const { Service } = require('feathers-sequelize');

exports.Spots = class Spots extends Service {
    async create(data) {
        data.area = setSRID(data.area, 4326);
        console.log(data);
        return super.create(data);
    }
};

function setSRID(geometry, srid) {
    return {
        ...geometry,
        crs: {
            type: 'name',
            properties: { name: `EPSG:${srid}` },
        },
    };
}