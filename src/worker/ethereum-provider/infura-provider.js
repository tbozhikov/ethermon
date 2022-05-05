const BaseWeb3Provider = require("./base-web3-provider");

class InfuraProvider extends BaseWeb3Provider {
    newBlockSubscription;

    constructor(projectId) {
        super(projectId, "wss://mainnet.infura.io/ws/v3", "https://mainnet.infura.io/v3");
    }
}

module.exports = InfuraProvider
