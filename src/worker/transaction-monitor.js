const InfuraProvider = require('./ethereum-provider/infura-provider');
const TransactionRepository = require('../data/repository/transaction-repository');
const LoggerService = require('../logging/logger-service');
const dynamicConfig = require('../config/dynamic-config');

const logger = LoggerService.getLogger(__filename.split("/").pop());
class TransactionMonitor {
    transactionFiltersMap;
    transactionRepository;

    constructor() {
        this.provider = new InfuraProvider();
        this.transactionRepository = new TransactionRepository();
        this.transactionFiltersMap = new Map();
        dynamicConfig.configChanged((newConfig) => { this.onConfigChanged(newConfig); });
    }

    onConfigChanged(newConfig) {
        logger.info(`Handling config change. New transaction filters: ${JSON.stringify(newConfig.transactionFilters, null, 2)}`)
        /**
         * build a map of <key: string, value: Array<any>>, where:
         * key: is the property name
         * value: the filters by which we should filter on the property name
         * */
        const filtersMap = new Map();
        if (newConfig && newConfig.transactionFilters) {
            newConfig.transactionFilters.forEach((f) => {
                if (filtersMap.has(f.field)) { // if filter by the same property exists, add to map
                    const existing = filtersMap.get(f.field);
                    filtersMap.set(f.field, [...existing, f])
                } else {
                    filtersMap.set(f.field, [f])
                }
            })
        } else {
            logger.warn("Config is empty, do not expect any tracking and persisting in DB")
        }

        this.transactionFiltersMap = filtersMap;
    }

    watchBlocks() {
        this.provider.watchBlocks((block) => {
            let transactions = block.transactions;
            logger.info(`Found ${transactions.length} new transactions.`)

            const filtered = transactions.filter((tx) => {
                let shouldFilterCurrent = false;

                for (let txKey of Object.keys(tx)) {
                    if (this.transactionFiltersMap.has(txKey)) {
                        const filters = this.transactionFiltersMap.get(txKey);
                        for (let filter of filters) {
                            switch (filter.criteria) {
                                case "equals":
                                    // assume string here, respect matchCase
                                    const txValue = filter.matchCase ? tx[txKey] : tx[txKey].toLowerCase();
                                    const filterValue = filter.matchCase ? filter.value : filter.value.toLowerCase();
                                    shouldFilterCurrent = filterValue === txValue;
                                    break;
                                case "above":
                                    // assume number, do not respect matchCase
                                    shouldFilterCurrent = tx[txKey] > filter.value
                                    break;
                                case "below":
                                    // assume number, do not respect matchCase
                                    shouldFilterCurrent = tx[txKey] < filter.value
                                    break;
                            }
                            if (shouldFilterCurrent) {
                                break;
                            }
                        }
                    }
                    if (shouldFilterCurrent) {
                        break;
                    }
                }

                return shouldFilterCurrent;
            });

            logger.info(`Adding ${filtered.length} transactions.`);

            filtered.forEach(tx => this.transactionRepository.create({ ...tx, configurationId: dynamicConfig.activeConfigRecord.id }));
        });
    }
}

module.exports = TransactionMonitor
