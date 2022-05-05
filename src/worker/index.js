// import TransactionChecker from "./transaction-checker";
const TransactionChecker = require("./transaction-checker");

console.log("Hello");

// TODO
// Load configuration
// Start API
// Start watching blocks/transactions

const PROJECT_ID = "0fed95ec59b547548116076c5f563adf"; // "Ethereum Monitor"

let txChecker = new TransactionChecker(PROJECT_ID);
// txChecker.subscribe("newBlockHeaders");
// txChecker.watchTransactions();
txChecker.watchBlocks();
