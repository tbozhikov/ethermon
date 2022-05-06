const config = require('config');

class ApplicationConfig {
    infuraProjectId;
    infuraWebSocketEndpoint;
    infuraHTTPEndpoint;
    dbPath;
    dbType;

    constructor() {
        this.infuraProjectId = config.get('infura.projectId');
        this.infuraWebSocketEndpoint = config.get('infura.webSocketEndpoint');
        this.infuraHTTPEndpoint = config.get('infura.httpEndpoint');
        this.dbType = config.get('db.type');
        this.dbPath = config.get('db.path');
        this.dbType = config.get('db.type');
    }
}

module.exports = new ApplicationConfig();
