// import TransactionChecker from "./transaction-checker";
const TransactionMonitor = require("./transaction-monitor");
const initDatabaseConnection = require("../db/init");

console.log("Worker is running");
initDatabaseConnection();

const PROJECT_ID = "0fed95ec59b547548116076c5f563adf"; // "Ethereum Monitor"

let txMonitor = new TransactionMonitor(PROJECT_ID);
txMonitor.watchBlocks();
