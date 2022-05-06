const express = require('express');
const initDatabase = require('../db/init');
const ConfigurationRepository = require('../data/repository/configuration-repository');
const LoggerService = require('../logging/logger-service');
const logger = LoggerService.getLogger(__filename.split("/").pop());

const startAPIServer = () => {
    initDatabase();
    const app = express();
    app.use(express.json());

    const server = app.listen(3000, () => {
        logger.info("API Server is running on port 3000");
    });


    // READ
    app.get("/api/configuration", async (req, res, next) => {
        const configurationRepository = new ConfigurationRepository();

        res.json(await configurationRepository.getAll());
    });

    // CREATE
    app.post("/api/configuration", async (req, res, next) => {
        const configurationRepository = new ConfigurationRepository();
        const configuration = req.body;

        if (configuration && configuration.transactionFilters) {
            const newConfig = await configurationRepository.create({
                configJSON: JSON.stringify(configuration)
            });

            await configurationRepository.setActive(newConfig.id);
            res.status(200).send(newConfig);
        } else {
            res.status(400).send("transactionFilters is mandatory.")
        }
    });

    // UPDATE
    app.put("/api/configuration/:id", async (req, res, next) => {
        const configurationRepository = new ConfigurationRepository();
        const configuration = req.body;
        const existingId = parseInt(req.params.id);

        if (!existingId) {
            res.status(400).send("id is mandatory");
        }

        if (configuration && configuration.transactionFilters) {
            // const existingConfig = await configurationRepository.getById(existingId);
            const updatedConfig = await configurationRepository.update(existingId, { configJSON: JSON.stringify(configuration) });

            await configurationRepository.setActive(updatedConfig.id);
            res.status(200).send(updatedConfig);
        } else {
            res.status(400).send("transactionFilters is mandatory.")
        }
    });

    // DELETE
    app.delete("/api/configuration/:id", async (req, res, next) => {
        const configurationRepository = new ConfigurationRepository();
        const existingId = parseInt(req.params.id);

        if (!existingId) {
            res.status(400).send("id is mandatory");
        }

        await configurationRepository.delete(existingId);
        res.sendStatus(200);
    });

    let errorHandler = function (err) {
        logger.err('process.on(uncaughtException): err:' + err);

        process.removeListener('uncaughtException', errorHandler);
        server.close();
        startAPIServer();
    }

    process.on('uncaughtException', errorHandler);
}

startAPIServer();
