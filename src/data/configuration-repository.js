const BaseRepository = require("./base-repository");
const Configuration = require("./models/configuration");

class ConfigurationRepository extends BaseRepository {
    constructor() {
        super();

        this.model = Configuration;
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
