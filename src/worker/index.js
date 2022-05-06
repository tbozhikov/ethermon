// import TransactionChecker from "./transaction-checker";
const TransactionMonitor = require("./transaction-monitor");
const initDatabaseConnection = require("../db/init");
const applicationConfig = require("../config/app-config");

console.log("Worker is running");
initDatabaseConnection();

let txMonitor = new TransactionMonitor(applicationConfig.projectId);
txMonitor.watchBlocks();
