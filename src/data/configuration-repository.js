const { Sequelize, Model, DataTypes } = require("sequelize");
const BaseRepository = require("./base-repository");
const Configuration = require("./models/configuration");

class ConfigurationRepository extends BaseRepository {
    constructor() {
        super();

        this.model = Configuration;
    }

    async count() {
        return await this.model.count();
    }

    async create(item) {
        return await this.model.create(item);
    }

    async update(id, updatedItem) {
        let item = await this.findOne(id);    
        const modified = Object.assign(item, updatedItem);
    
        await modified.save();
    }

    async delete(id) {
        this.model.destroy({
            where: {
                id: id
            }
        });

        this.model.delete()
    }

    async getActive() {
        return await this.model.findOne({
            where: {
                appliedAt: true,
            },
        });
    }

    async getMostRecentlyApplied() {
        // return await this.model.max("appliedAt");
        return await this.model.findOne({ order: [['appliedAt', 'DESC']] });
    }

    async findOne(id) {
        return await this.model.findOne({
            where: {
                id: id,
            },
        })
    }
}

module.exports = ConfigurationRepository;
