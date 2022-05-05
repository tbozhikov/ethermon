const config = require("config");
const EventEmitter = require('events');
const Configuration = require("../data/models/configuration");
const ConfigurationRepository = require("../data/configuration-repository");

class DynamicConfig {
    _activeConfigRecord;
    activeConfig;
    // transactionsFilter;
    // dbConfiguration;
    eventEmitter;
    configurationRepository;

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.configurationRepository = new ConfigurationRepository();
        // this.refreshActiveConfig();
    }

    async updateConfig(config) {
        this.configurationRepository.create({
            appliedAt: Date.now(),
            configJSON: JSON.stringify(config || dynamicConfig.getDefault()),
            isActive: true
        });

        await this.refreshActiveConfig();
    }

    async initActiveConfig() {
        let configurationRecord;
        if (await this.configurationRepository.count() === 0) {
            configurationRecord = await this.configurationRepository.create({
                appliedAt: Date.now(),
                configJSON: JSON.stringify(this.getDefault()),
                isActive: true
            });
        } else {
            configurationRecord = await this.configurationRepository.getMostRecentlyApplied();
            await this.configurationRepository.update(configurationRecord.id, { isActive: true })
        }

        return configurationRecord;
    }

    async refreshActiveConfig() {
        let activeConfigurationRecord = await this.configurationRepository.getActive();

        if (!activeConfigurationRecord) {
            activeConfigurationRecord = await this.initActiveConfig();
        }

        console.log("activeConfigurationRecord: ")
        console.log(JSON.stringify(activeConfigurationRecord, null, 2));

        this.activeConfig = JSON.parse(activeConfigurationRecord.configJSON);

        if (this._activeConfigRecord?.id !== activeConfigurationRecord.id) {
            this._activeConfigRecord = activeConfigurationRecord;
            this.eventEmitter.emit("configChanged", this.activeConfig);
        }
    }

    configChanged(callback) {
        this.eventEmitter.on("configChanged", callback(this.activeConfig));
    }

    getDefault() {
        return {
            transactionsFilter: {
                "to": "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72"
            },
            dbConfiguration: {
                "filename": "database.sqlite"
            }
        };
    }
}

module.exports = new DynamicConfig(); // use this class as singleton object
