const BaseRepository = require('./base-repository');
const Configuration = require('../models/configuration')

class ConfigurationRepository extends BaseRepository {
    constructor() {
        super();

        this.model = Configuration;
    }

    /**
     * Sets the configuration with given id as active, 
     * while deactivating the current active one
     * @param {number} id 
     */
    async setActive(id) {
        const currentActive = await this.getActive();
        await this.update(currentActive.id,
            {
                isActive: false
            });
        await this.update(id, {
            isActive: true,
            appliedAt: Date.now()
        });
    }

    async getActive() {
        const active = await this.model.findOne({
            where: {
                isActive: true
            }
        });

        return active;
    }

    async getMostRecentlyApplied() {
        // return await this.model.max("appliedAt");
        return await this.model.findOne({ order: [['appliedAt', 'DESC']] });
    }
}

module.exports = ConfigurationRepository;
