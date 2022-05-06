const BaseWeb3Provider = require("./base-web3-provider");
const applicationConfig = require('../../config/app-config');

class InfuraProvider extends BaseWeb3Provider {
    newBlockSubscription;

    constructor() {
        super(`${applicationConfig.infuraWebSocketEndpoint}/${applicationConfig.infuraProjectId}`, `${applicationConfig.infuraHTTPEndpoint}/${applicationConfig.infuraProjectId}`);
    }
}

module.exports = InfuraProvider;
