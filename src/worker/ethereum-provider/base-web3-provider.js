const BaseProvider = require('./base-provider');
const Web3 = require('web3');
const LoggerService = require('../../logging/logger-service');
const logger = LoggerService.getLogger(__filename.split("/").pop());
class BaseWeb3Provider extends BaseProvider {
    projectId;
    wsUrl;
    httpUrl;

    constructor(wsUrl, httpUrl) {
        super();
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider(wsUrl))
        this.web3 = new Web3(new Web3.providers.HttpProvider(httpUrl))
    }

    watchBlocks(callback) {
        logger.info("Watching blocks with transactions ...");
        
        this.newBlockSubscription = this.web3ws.eth.subscribe("newBlockHeaders", (err, res) => {
            if (err) {
                logger.error(err);
            }
        })

        this.newBlockSubscription.on("data", async (blockHeader) => {
            logger.info(`Added new block with hash: ${blockHeader.hash}`);

            try {
                let block = await this.web3.eth.getBlock(blockHeader.hash, true);
                if (block !== null) {
                    callback(block);
                }
            } catch (err) {
                logger.error(err);
            }
        })
    }
}

module.exports = BaseWeb3Provider
