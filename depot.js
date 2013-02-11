/* ----------------------------------
 * depot.js v0.1.0
 * Licensed under The MIT License
 * http://opensource.org/licenses/MIT
 * ---------------------------------- */

// commonjs, amd, global
(function (name, root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root[name] = factory();
  }
}("depot", this, function () {
  
  "use strict";

  // depot api

  var api = {

    save: function (record) {
      var id;

      if (!record[this.idAttribute]) {
        record[this.idAttribute] = guid();
      }

      id = record[this.idAttribute];

      if (this.ids.indexOf(id) < 0) {
        this.ids.push(id);
        localStorage.setItem(this.name, this.ids.join(","));
      }

      localStorage.setItem(getKey(this.name, id), JSON.stringify(record));

      return record;
    },

    updateAll: function (data) {
      var records = this.all();

      records.forEach(function (record) {
        record = extend(record, data);
        this.save(record);
      }, this);
    },

    find: function (query) {
      var key, match, record;
      var name = this.name;

      return this.ids.reduce(function (memo, id) {
        record = localStorage.getItem(getKey(name, id));

        if (record) {
          record = jsonData(record);
          match = true;

          if (query) {
            for (key in query) {
              match &= (query[key] == record[key]);
            }
          }

          if (match) {
            memo.push(record);
          }
        }

        return memo;
      }, []);
    },

    get: function (id) {
      return jsonData(localStorage.getItem(getKey(this.name, id))); 
    },

    all: function () {
      var record, name = this.name;

      return this.ids.reduce(function (memo, id) {
        record = localStorage.getItem(getKey(name, id));

        if (record) {
          memo.push(jsonData(record));
        }

        return memo;
      }, []);
    },

    destroy: function (record) {
      var index;
      var id = (record[this.idAttribute]) ? record[this.idAttribute] : record;

      localStorage.removeItem(getKey(this.name, id));

      index = this.ids.indexOf(id);
      if (index != -1) this.ids.splice(index, 1); 
      localStorage.setItem(this.name, this.ids.join(","));

      return record;
    },

    destroyAll: function () {
      this.ids.forEach(function (id) {
        localStorage.removeItem(getKey(this.name, id));
      }, this);

      localStorage.removeItem(this.name);
      this.ids = [];
    }
  };

  // helpers
  
  function jsonData(data) {
    return data && JSON.parse(data);
  }

  function getKey(name, id) {
    return name + "-" + id;
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1);
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + 
      '-' +s4() + '-' + s4() + s4() + s4();
  }

  function extend(dest, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }

    return dest;
  }

  function depot(name, options) {
    var store, ids;

    if (!localStorage) throw new Error("localStorage not found");

    store = localStorage.getItem(name);
    ids = (store && store.split(",")) || [];
    options = options || {};

    return Object.create(api, { 
      name: { value: name },
      store: { value: store },
      ids: { value: ids, writable: true },
      idAttribute: { value: options.idAttribute || '_id' }
    });
  }

  return depot;
}));
