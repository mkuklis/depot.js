export default class Depot {
  constructor(name, options) {
    this.adaptor = new options.storageAdaptor(options);
  }

  save(record) {
    return this.adaptor.save(record);
  }

  saveAll(records) {
    records.forEach(record => this.adaptor.save(record));
    return this.all();
  }

  update(id, data) {
    return this.adaptor.update(id, data);
  }

  updateAll(data) {
    return this.adaptor.updateAll(data);
  }

  find(criteria) {
    return this.adaptor.find(criteria);
  }

  get(id) {
    return this.adaptor.get(id);
  }

  all() {
    return this.adaptor.all();
  }

  destroy(record) {
    return this.adaptor.destroy(record);
  }

  destroyAll(criteria) {
    return this.adaptor.destroyAll(criteria);
  }

  size() {
    return this.adaptor.size();
  }
}
