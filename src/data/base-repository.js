class BaseRepository {
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

    return modified;
  }

  async delete(id) {
    await this.model.destroy({
      where: {
        id: id
      }
    });
  }

  async getById(id) {
    return await this.model.findOne({
      where: {
        id: id,
      },
    })
  }

  async getAll(id) {
    return await this.model.findAll();
  }
}

module.exports = BaseRepository;
