const InfuraProvider = require("./ethereum-provider/infura-provider");

const BINANCE_ADDR = "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8";
const ENS = "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72" // https://ethplorer.io/address/0xc18360217d8f7ab5e7c516566761ea12ce7f9d72#chart=candlestick

class TransactionChecker {
    constructor(projectId) {
        this.provider = new InfuraProvider(projectId);
    }

    watchBlocks() {
        this.provider.watchBlocks((block) => {
            let transactions = block.transactions;
            console.log(`Found ${transactions.length} new transactions.`)
            console.log(`${JSON.stringify(transactions, null, 2)}`)

            for (let tx of transactions) {
                if (tx.from.toLowerCase() === BINANCE_ADDR || tx.to.toLowerCase() === BINANCE_ADDR) {
                    console.log(`[BINANCE] Transaction: ${tx.from} -> ${tx.to}`);
                } else {
                    console.log(`Transaction: ${tx.from} -> ${tx.to}`);
                }
            }
        });
    }
}

module.exports = TransactionChecker
