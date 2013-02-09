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
      if (!record.id) {
        record.id = guid();
      }

      if (this.ids.indexOf(record.id) < 0) {
        this.ids.push(record.id);
      }

      localStorage.setItem(this.name + "-" + record.id, JSON.stringify(record));
      localStorage.setItem(this.name, this.ids.join(","));

      return record;
    },

    find: function (record) {
      var id = (record.id) ? record.id : record;
      return jsonData(localStorage.getItem(this.name + "-" + id));
    },

    all: function () {
      var record, name = this.name;

      return this.ids.reduce(function (memo, id) {
        record =  localStorage.getItem(name + "-" + id);

        if (record) {
          memo.push(jsonData(localStorage.getItem(name + "-" + id)));
        }

        return memo;
      }, []);
    },

    destroy: function (record) {
      var index;
      var id = (record.id) ? record.id : record;

      localStorage.removeItem(this.name + "-" + id);

      index = this.ids.indexOf(id);
      if (index != -1) this.ids.splice(index, 1); 
      localStorage.setItem(this.name, this.ids.join(","));

      return record;
    },

    destroyAll: function () {
      localStorage.clear();
    }
  };

  // helpers
  function jsonData(data) {
    return data && JSON.parse(data);
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + 
      '-' +s4() + '-' + s4() + s4() + s4();
  }

  function depot(name) {

    if (!localStorage) throw new Error("localStorage not found");

    var store = localStorage.getItem(name);

    return Object.create(api, { 
      name: { value: name },
      store: { value: store },
      ids: { value: (store && store.split(",")) || [] }
    });
  }

  return depot;
}));
