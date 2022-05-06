const BaseRepository = require("./base-repository");
const Transaction = require("./models/transaction");

class TransactionRepository extends BaseRepository {
    constructor() {
        super();

        this.model = Transaction;
    }
}

module.exports = TransactionRepository;
