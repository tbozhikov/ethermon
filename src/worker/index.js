console.log("Hello");
const Web3 = require('web3');

const TEST_WEBSOCKET_URL = "wss://mainnet.infura.io/ws/v3";
const TEST_HTTP_URL = "https://mainnet.infura.io/v3";
// const PROJECT_ID = "bbab9a8cf1714171ae1f9dcf28609f5e"; // ethermon
const PROJECT_ID = "0fed95ec59b547548116076c5f563adf"; // "Ethereum Monitor"
const BINANCE_ADDR = "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8";

const ENS = "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72" // https://ethplorer.io/address/0xc18360217d8f7ab5e7c516566761ea12ce7f9d72#chart=candlestick

class TransactionChecker {
    web3;
    web3ws;
    // account;
    subscription;

    constructor(projectId) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider(`${TEST_WEBSOCKET_URL}/${projectId}`))
        this.web3 = new Web3(new Web3.providers.HttpProvider(`${TEST_HTTP_URL}/${projectId}`))
        // this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) {
                console.log(err);
            }
        })
    }

    watchTransactions() {
        console.log("Watching transactions ...");

        this.subscription.on("data", (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    let txReceipt = await this.web3.eth.getTransactionReceipt(txHash);
                    if (tx !== null) {
                        // console.log(`Transaction: ${JSON.stringify(tx, null, 2)}`);
                        if (tx.from.toLowerCase() === BINANCE_ADDR || tx.to.toLowerCase() === BINANCE_ADDR) {
                            console.log(`[BINANCE] Transaction: ${tx.from} -> ${tx.to}`);
                        } else {
                            console.log( `Transaction: ${tx.from} -> ${tx.to}`);
                        }
                    }
                    if (txReceipt !== null) {
                        console.log( `Transaction receipt: ${JSON.stringify(txReceipt, null, 2)}`);
                    }
                } catch (err) {
                    console.log(err);
                }
            }, 30000)
        })
    }
}

let txChecker = new TransactionChecker(PROJECT_ID);
txChecker.subscribe("pendingTransactions");
txChecker.watchTransactions();
