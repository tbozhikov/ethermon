const { Model } = require('sequelize');

class Transaction extends Model {
    to;
    from;
}

module.exports = Transaction;
