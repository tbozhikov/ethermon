class BaseRepository {
  constructor() {

  }

  async all() {
    return this.model.findAll();
  }
}

module.exports = BaseRepository;
