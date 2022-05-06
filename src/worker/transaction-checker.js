const InfuraProvider = require("./ethereum-provider/infura-provider");
const dynamicConfig = require("../config/dynamic-config");
const TransactionRepository = require('../data/transaction-repository');

class TransactionChecker {
    transactionFiltersMap;

    constructor(projectId) {
        this.provider = new InfuraProvider(projectId);
        dynamicConfig.configChanged((newConfig) => { this.onConfigChanged(newConfig); });
        this.transactionRepository = new TransactionRepository();
        // dynamicConfig.refreshActiveConfig();
    }

    onConfigChanged(newConfig) {
        console.log(`[Config change] New transaction filters: ${JSON.stringify(newConfig.transactionFilters, null, 2)}`);

        const filtersMap = new Map();
        newConfig.transactionFilters.forEach((f) => { filtersMap.set(f.field, f) })

        this.transactionFiltersMap = filtersMap;
    }

    watchBlocks() {
        this.provider.watchBlocks((block) => {
            let transactions = block.transactions;
            console.log(`Found ${transactions.length} new transactions.`)

            if (transactions.filter(tx => tx.gas > 21000)) {
                console.log(`Found ${transactions.filter(tx => tx.gas > 21000).length} transactions with larger gas.`)
            }

            const filtered = transactions.filter((tx) => {
                let shouldFilterCurrent = false;

                for (let txKey of Object.keys(tx)) {
                    if (this.transactionFiltersMap.has(txKey)) {
                        const filter = this.transactionFiltersMap.get(txKey);

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
                    }
                    if (shouldFilterCurrent) {
                        break;
                    }
                }

                return shouldFilterCurrent;
            });

            console.log(`Adding ${filtered.length} transactions.`)
            console.log(`Transactions: ${JSON.stringify(filtered)}`)

            filtered.forEach(tx => this.transactionRepository.create({ ...tx, configurationId: dynamicConfig.activeConfigRecord.id }));
        });
    }
}

module.exports = TransactionChecker
