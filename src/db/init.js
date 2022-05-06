const { Sequelize, Model, DataTypes } = require('sequelize');
const Transaction = require("../data/models/transaction");
const Configuration = require("../data/models/configuration");
const dynamicConfig = require("../config/dynamic-config");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/db/database.sqlite'
});
function initDatabaseConnection() {
    console.log("Initializing DB");
    Transaction.init({
        hash: DataTypes.STRING,
        blockhHash: DataTypes.STRING,
        transactionIndex: DataTypes.NUMBER,
        to: DataTypes.STRING,
        from: DataTypes.STRING,
        gas: DataTypes.NUMBER,
        gasPrice: DataTypes.STRING,
        configurationId: DataTypes.NUMBER
    }, { sequelize, modelName: 'transaction', tableName: "Transaction" });

    Configuration.init({
        appliedAt: DataTypes.DATE,
        configJSON: DataTypes.TEXT,
        isActive: DataTypes.BOOLEAN,
    }, { sequelize, modelName: "configuration", tableName: "Configuration" });

    (async () => {
        await sequelize.sync();
        await dynamicConfig.refreshActiveConfig();

        console.log(await Configuration.findAll());
    })();
}

module.exports = initDatabaseConnection;

