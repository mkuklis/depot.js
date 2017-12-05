import CoreAdaptor from './core_adaptor';
import util from'../util';

export default class LocalStorageAdaptor extends CoreAdaptor {
  constructor(options = {}) {
    super(options);

    this.storageAdaptor = options.storageType || localStorage;
    this.refresh();
  }

  save(record) {
    this.refresh();

    if (!record[this.idAttribute]) {
      record[this.idAttribute] = util.guid();
    }

    const id = record[this.idAttribute] + '';

    if (this.ids.indexOf(id) < 0) {
      this.ids.push(id);
      const ids = this.ids.join(",");
      this.storageAdaptor.setItem(this.name, ids);
      this.store = ids;
    }

    const key = util.getKey(this.name, id);

    this.storageAdaptor.setItem(key, util.toString(record));

    return record;
  }

  find(criteria) {
    return this.all(criteria);
  }

  get(id) {
    const key = util.getKey(this.name, id);
    const recordStr = this.storageAdaptor.getItem(key);
    return util.toJSON(recordStr);
  }

  all(criteria) {
    this.refresh();

    return this.ids.reduce((records, id) => {
      const key = util.getKey(this.name, id);
      const record = util.toJSON(this.storageAdaptor.getItem(key));

      if (!record) {
        return records;
      }

      if (criteria) {
        const match = util.findMatch(criteria, record);
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

  destroy(record) {
    const id = (record[this.idAttribute]) ? record[this.idAttribute] : record;
    const key = util.getKey(this.name, id);
    record = util.toJSON(this.storageAdaptor.getItem(key));

    this.storageAdaptor.removeItem(key);

    const index = this.ids.indexOf(id + '');
    if (index != -1) this.ids.splice(index, 1);
    this.storageAdaptor.setItem(this.name, this.ids.join(","));

    return record;
  }

  destroyAll(criteria) {
    this.refresh();

    for (let i = this.ids.length - 1; i >= 0; i--) {
      const id = this.ids[i];
      const key = util.getKey(this.name, id);

      if (criteria) {
        const record = util.toJSON(this.storageAdaptor.getItem(key));
        const match = util.findMatch(criteria, record);

        if (match) {
          this.storageAdaptor.removeItem(key);
          this.ids.splice(i, 1);
        }

      }
      else {
        this.storageAdaptor.removeItem(key);
      }
    }

    if (criteria) {
      this.storageAdaptor.setItem(this.name, this.ids.join(","));
    }
    else {
      this.storageAdaptor.removeItem(this.name);
      this.ids = [];
      this.store = null;
    }
  }

  refresh() {
    const store = this.storageAdaptor.getItem(this.name);

    if (this.store && this.store === store) {
      return;
    }

    this.ids = (store && store.split(",")) || [];
    this.store = store;
  }
}
