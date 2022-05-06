const config = require('config');

class ApplicationConfig {
    projectId;
    dbPath;
    dbType;

    constructor() {
        this.projectId = config.get('infura.projectId');
        this.dbPath = config.get('db.path');
        this.dbType = config.get('db.type');
    }
}

module.exports = new ApplicationConfig();
