"use strict";

import util from '../util';

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

    var record = this.get(id);
    if (record) {
      record = util.extend(record, data);
      this.save(record);
    }

    return record;
  }

  updateAll(data) {
    let records = this.all();

    records.forEach((record) => {
      record = util.extend(record, data);
      this.save(record);
    });

    return records;
  }

  size() {
    this.refresh();
    return this.ids.length;
  }
}