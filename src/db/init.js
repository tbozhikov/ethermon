const { Sequelize, Model, DataTypes } = require('sequelize');
const Transaction = require("../data/models/transaction");
const Configuration = require("../data/models/configuration");
const dynamicConfig = require("../config/dynamic-config");
const ConfigurationRepository = require("../data/configuration-repository");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

Transaction.init({
    hash: DataTypes.STRING,
    blockhHash: DataTypes.STRING,
    transactionIndex: DataTypes.NUMBER,
    to: DataTypes.STRING,
    from: DataTypes.STRING,
    gas: DataTypes.NUMBER,
    gasPrice: DataTypes.STRING
}, { sequelize, modelName: 'transaction', tableName: "Transaction" });
(async () => {
    await sequelize.sync();
    console.log(await Transaction.findAll());
})();

Configuration.init({
    appliedAt: DataTypes.DATE,
    configJSON: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN,
}, { sequelize, modelName: "configuration", tableName: "Configuration" });
(async () => {
    await sequelize.sync();

    await dynamicConfig.refreshActiveConfig();
    // const configurationRepository = new ConfigurationRepository();
    // if (await configurationRepository.count() === 0) {
    //     configurationRepository.create({
    //         appliedAt: Date.now(),
    //         configJSON: JSON.stringify(dynamicConfig.getDefault()),
    //         isActive: true
    //     });
    // }

    console.log(await Configuration.findAll());
})();

