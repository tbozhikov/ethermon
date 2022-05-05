const { Sequelize, Model, DataTypes } = require("sequelize");
const BaseRepository = require("./base-repository");
const Transaction = require("./models/transaction");

class TransactionRepository extends BaseRepository{
    constructor() {
        super();

        this.model = Transaction;
    }

    async create(item) {
        this.model.create(item);
    }

    async update(id, updatedItem) {
        let item = await this.findOne(id);

        item = {
            ...item,
            ...updatedItem
        }

        await item.save();
    }

    async delete(id) {
        this.model.destroy({
            where: {
                id: id
            }
        });

        this.model.delete()
    }

    async findOne(id) {
        return await this.model.findOne({
            where: {
                id: id,
            },
        })
    }
}

module.exports = TransactionRepository;
