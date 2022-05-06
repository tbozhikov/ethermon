const EventEmitter = require('events');
const ConfigurationRepository = require('../data/repository/configuration-repository');
const LoggerService = require('../logging/logger-service');
const applicationConfig = require('./app-config');
const logger = LoggerService.getLogger(__filename.split("/").pop());
class DynamicConfig {
    activeConfigRecord;
    activeConfig;
    eventEmitter;
    configurationRepository;

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.configurationRepository = new ConfigurationRepository();

        this.scheduleChangeDetection();
    }

    async scheduleChangeDetection() {
        logger.info(`Scheduling config change detection mechanism. (each ${applicationConfig.dynamicConfigRefreshInterval} milliseconds)`);
        setInterval(async () => {
            try {
                logger.info(`Checking for config changes...`);
                const active = await this.configurationRepository.getActive();
                if (!this.activeConfigRecord || active.id !== this.activeConfigRecord.id || active.appliedAt.toISOString() != this.activeConfigRecord.appliedAt.toISOString()) {
                    logger.info(`Configuration change detected! Reloading: ${JSON.stringify(active, null, 2)}`);
                    
                    await this.refreshActiveConfig();
                }
            } catch (err) {
                logger.info(`Error while checking/applying new configs: ${JSON.stringify(err)}`);
            }
        }, applicationConfig.dynamicConfigRefreshInterval);
    }

    async initActiveConfig() {
        let configurationRecord;
        if (await this.configurationRepository.count() === 0) {
            configurationRecord = await this.configurationRepository.create({
                appliedAt: Date.now(),
                configJSON: JSON.stringify(this.getEmptyConfig()),
                isActive: true
            });
        } else {
            configurationRecord = await this.configurationRepository.getMostRecentlyApplied();
            await this.configurationRepository.update(configurationRecord.id, { isActive: true });
        }

        return configurationRecord;
    }

    async refreshActiveConfig() {
        let activeConfigurationRecord = await this.configurationRepository.getActive();
        if (!activeConfigurationRecord) {
            activeConfigurationRecord = await this.initActiveConfig();
        }

        logger.info(`Active configuration: ${JSON.stringify(activeConfigurationRecord, null, 2)}`);

        this.activeConfig = JSON.parse(activeConfigurationRecord.configJSON);

        if (!this.activeConfigRecord || this.activeConfigRecord.id !== activeConfigurationRecord.id) {
            this.activeConfigRecord = activeConfigurationRecord;
            this.eventEmitter.emit("configChanged", this.activeConfig);
        }
    }

    configChanged(callback) {
        this.eventEmitter.on("configChanged", callback);
    }

    getEmptyConfig() { return {}; }
}

module.exports = new DynamicConfig(); // use this class as singleton object
