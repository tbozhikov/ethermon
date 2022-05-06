const TransactionMonitor = require('./transaction-monitor');
const initDatabase = require('../db/init');
const applicationConfig = require('../config/app-config');

console.log("Worker is running");

initDatabase();

let txMonitor = new TransactionMonitor();
txMonitor.watchBlocks();
