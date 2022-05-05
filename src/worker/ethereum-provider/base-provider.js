class BaseProvider {
    constructor() {
    }

    watchBlocks() {
        throw new Error("Not implemented in base class.");
    }
}

module.exports = BaseProvider
