export default class CoreAdaptor {

  constructor(options) {
    this.name = options.name;
    this.idAttribute = options.idAttribute;
  }

  update(id, data) {
    if (typeof data == 'undefined') {
      data = id;
      id = data[this.idAttribute];
    }

    const record = this.get(id);

    if (record) {
      this.save(Object.assign(record, data));
    }

    return record;
  }

  updateAll(data) {
    const records = this.all();

    records.forEach(record =>
      this.save(Object.assign(record, data)));

    return records;
  }

  size() {
    this.refresh();
    return this.ids.length;
  }
}
