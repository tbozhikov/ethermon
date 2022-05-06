class BaseRepository {
  constructor() {

  }

  async count() {
    return await this.model.count();
  }

  async create(item) {
    return await this.model.create(item);
  }

  async update(id, updatedItem) {
    let item = await this.getById(id);
    const modified = Object.assign(item, updatedItem);

    await modified.save();
  }

  async delete(id) {
    this.model.destroy({
      where: {
        id: id
      }
    });

    this.model.delete()
  }
  async getById(id) {
    return await this.model.findOne({
        where: {
            id: id,
        },
    })
}
}

module.exports = BaseRepository;
