"use strict";

import CoreAdaptor from './core_adaptor';
import util from'../util';

export default class FileAdaptor extends CoreAdaptor {
  constructor(options) {
    super(options);
    this.store = [];
    this.ids = [];
  }

  save(record) {
    if (!record[this.idAttribute]) {
      record[this.idAttribute] = util.guid();
    }

    let id = record[this.idAttribute];

    if (this.ids.indexOf(id) < 0) {
      this.store.push(record);
      this.ids.push(id);
    }

    return record;
  }

  find(criteria) {
    return this.ids.reduce((records, id, index) => {
      let record = this.store[index];
      if (!record)  return records;

      if (criteria) {
        let match = util.findMatch(criteria, record);
        if (match) {
          records.push(record);
        }
      }
      else {
        records.push(record);
      }

      return records;
    }, []);
  }

  get(id) {
    let index = this.ids.indexOf(id);
    return this.store[index];
  }

  all() {
    return this.store;
  }

  destroy(record) {
    let id = (record[this.idAttribute]) ? record[this.idAttribute] : record;
    let index = this.ids.indexOf(id);

    if (index != -1) {
      this.ids.splice(index, 1);
      this.store.splice(index, 1);
    }

    return record;
  }

  destroyAll(criteria) {
    if (!criteria) {
      this.store = [];
      this.ids = [];
      return;
    }

    for (let i = this.ids.length - 1; i >= 0; i--) {
      let id = this.ids[i];
      let record = this.store[i];
      let match = util.findMatch(criteria, record);

      if (match) {
        this.store.splice(i, 1);
        this.ids.splice(i, 1);
      }
    }
  }
}