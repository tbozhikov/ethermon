const BaseProvider = require('./base-provider');
const Web3 = require('web3');

class BaseWeb3Provider extends BaseProvider {
    projectId;
    wsUrl;
    httpUrl;

    constructor(projectId, wsUrl, httpUrl) {
        super();
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider(`${wsUrl}/${projectId}`))
        this.web3 = new Web3(new Web3.providers.HttpProvider(`${httpUrl}/${projectId}`))
    }

    watchBlocks(callback) {
        console.log("Watching blocks with transactions ...");

        this.newBlockSubscription = this.web3ws.eth.subscribe("newBlockHeaders", (err, res) => {
            if (err) {
                console.log(err);
            }

            console.log(res)
        })

        this.newBlockSubscription.on("data", async (blockHeader) => {
            console.log(`New block: ${JSON.stringify(blockHeader, null, 2)}`)

            try {
                let block = await this.web3.eth.getBlock(blockHeader.hash, true);
                if (block !== null) {
                    callback(block);
                }
            } catch (err) {
                console.log(err);
            }
        })
    }
}

module.exports = BaseWeb3Provider
