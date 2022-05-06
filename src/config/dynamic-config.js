const EventEmitter = require('events');
const ConfigurationRepository = require("../data/configuration-repository");

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
        console.log(`Scheduling config change detection mechanism.`);

        setInterval(async () => {
            try {
                console.log(`Checking for config changes...`);
                const active = await this.configurationRepository.getActive();
                if (!this.activeConfigRecord || active.id !== this.activeConfigRecord.id || active.appliedAt.toISOString() != this.activeConfigRecord.appliedAt.toISOString()) {
                    console.log(`Configuration change detected! Reloading: ${JSON.stringify(active, null, 2)}`);
                    await this.refreshActiveConfig();
                }
            } catch (err) {
                console.log(`Error while checking/applying new configs: ${JSON.stringify(err)}`);
            }
        }, 10000);
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

        console.log(`Active configuration: ${JSON.stringify(activeConfigurationRecord, null, 2)}`);

        this.activeConfig = JSON.parse(activeConfigurationRecord.configJSON);

        if (!this.activeConfigRecord || this.activeConfigRecord.id !== activeConfigurationRecord.id) {
            this.activeConfigRecord = activeConfigurationRecord;
            this.eventEmitter.emit("configChanged", this.activeConfig);
        }
    }

    configChanged(callback) {
        this.eventEmitter.on("configChanged", callback);
    }

    getDefault() {
        return {
            transactionFilters: [{
                "field": "to",
                "value": "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
                "criteria": "equals",
                "matchCase": false
            },
            {
                "field": "gas",
                "value": "21000",
                "criteria": "above"
            }]
        };
    }
}

module.exports = new DynamicConfig(); // use this class as singleton object
