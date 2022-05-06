const config = require('config');

class ApplicationConfig {
    infuraProjectId;
    infuraWebSocketEndpoint;
    infuraHTTPEndpoint;
    dbPath;
    dbType;
    loggingFileLevel;
    loggingFilePath;
    loggingConsoleLevel;
    dynamicConfigRefreshInterval;

    constructor() {
        this.infuraProjectId = config.get('infura.projectId');
        this.infuraWebSocketEndpoint = config.get('infura.webSocketEndpoint');
        this.infuraHTTPEndpoint = config.get('infura.httpEndpoint');
        this.dbType = config.get('db.type');
        this.dbPath = config.get('db.path');
        this.loggingFileLevel = config.get('logging.file.level');
        this.loggingFilePath = config.get('logging.file.path');
        this.loggingConsoleLevel = config.get('logging.console.level');
        this.dynamicConfigRefreshInterval = config.get('dynamicConfig.refreshInterval');
    }
}

module.exports = new ApplicationConfig();
