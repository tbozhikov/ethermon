const TransactionMonitor = require('./transaction-monitor');
const initDatabase = require('../db/init');
const LoggerService = require('../logging/logger-service');
const logger = LoggerService.getLogger(__filename.split("/").pop());

logger.info("Worker is running");

initDatabase();

let txMonitor = new TransactionMonitor();
txMonitor.watchBlocks();

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught error: ${JSON.stringify(err)}`);
});
