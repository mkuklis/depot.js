'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Depot = function () {
  function Depot(name, options) {
    classCallCheck(this, Depot);

    this.adaptor = new options.storageAdaptor(options);
  }

  createClass(Depot, [{
    key: "save",
    value: function save(record) {
      return this.adaptor.save(record);
    }
  }, {
    key: "update",
    value: function update(id, data) {
      return this.adaptor.update(id, data);
    }
  }, {
    key: "updateAll",
    value: function updateAll(data) {
      return this.adaptor.updateAll(data);
    }
  }, {
    key: "find",
    value: function find(criteria) {
      return this.adaptor.find(criteria);
    }
  }, {
    key: "get",
    value: function get$$1(id) {
      return this.adaptor.get(id);
    }
  }, {
    key: "all",
    value: function all() {
      return this.adaptor.all();
    }
  }, {
    key: "destroy",
    value: function destroy(record) {
      return this.adaptor.destroy(record);
    }
  }, {
    key: "destroyAll",
    value: function destroyAll(criteria) {
      return this.adaptor.destroyAll(criteria);
    }
  }, {
    key: "size",
    value: function size() {
      return this.adaptor.size();
    }
  }]);
  return Depot;
}();

var CoreAdaptor = function () {
  function CoreAdaptor(options) {
    classCallCheck(this, CoreAdaptor);

    this.name = options.name;
    this.idAttribute = options.idAttribute;
  }

  createClass(CoreAdaptor, [{
    key: 'update',
    value: function update(id, data) {
      if (typeof data == 'undefined') {
        data = id;
        id = data[this.idAttribute];
      }

      var record = this.get(id);

      if (record) {
        this.save(Object.assign(record, data));
      }

      return record;
    }
  }, {
    key: 'updateAll',
    value: function updateAll(data) {
      var _this = this;

      var records = this.all();

      records.forEach(function (record) {
        return _this.save(Object.assign(record, data));
      });

      return records;
    }
  }, {
    key: 'size',
    value: function size() {
      this.refresh();
      return this.ids.length;
    }
  }]);
  return CoreAdaptor;
}();

function toJSON(str) {
  return str && JSON.parse(str);
}

function toString(data) {
  return data && JSON.stringify(data);
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function findMatch(criteria, record) {
  var match = void 0,
      attr = void 0;

  if (typeof criteria == 'function') {
    match = criteria(record);
  } else {
    match = true;
    for (attr in criteria) {
      match &= criteria[attr] === record[attr];
    }
  }

  return match;
}

function getKey(name, id) {
  return name + "-" + id;
}

var util = {
  toJSON: toJSON,
  guid: guid,
  findMatch: findMatch,
  getKey: getKey,
  toString: toString
};

var LocalStorageAdaptor = function (_CoreAdaptor) {
  inherits(LocalStorageAdaptor, _CoreAdaptor);

  function LocalStorageAdaptor() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, LocalStorageAdaptor);

    var _this = possibleConstructorReturn(this, (LocalStorageAdaptor.__proto__ || Object.getPrototypeOf(LocalStorageAdaptor)).call(this, options));

    _this.storageAdaptor = options.storageType || localStorage;
    _this.refresh();
    return _this;
  }

  createClass(LocalStorageAdaptor, [{
    key: 'save',
    value: function save(record) {
      this.refresh();

      if (!record[this.idAttribute]) {
        record[this.idAttribute] = util.guid();
      }

      var id = record[this.idAttribute] + '';

      if (this.ids.indexOf(id) < 0) {
        this.ids.push(id);
        var ids = this.ids.join(",");
        this.storageAdaptor.setItem(this.name, ids);
        this.store = ids;
      }

      var key = util.getKey(this.name, id);

      this.storageAdaptor.setItem(key, util.toString(record));

      return record;
    }
  }, {
    key: 'find',
    value: function find(criteria) {
      return this.all(criteria);
    }
  }, {
    key: 'get',
    value: function get$$1(id) {
      var key = util.getKey(this.name, id);
      var recordStr = this.storageAdaptor.getItem(key);
      return util.toJSON(recordStr);
    }
  }, {
    key: 'all',
    value: function all(criteria) {
      var _this2 = this;

      this.refresh();

      return this.ids.reduce(function (records, id) {
        var key = util.getKey(_this2.name, id);
        var record = util.toJSON(_this2.storageAdaptor.getItem(key));

        if (!record) {
          return records;
        }

        if (criteria) {
          var match = util.findMatch(criteria, record);
          if (match) {
            records.push(record);
          }
        } else {
          records.push(record);
        }

        return records;
      }, []);
    }
  }, {
    key: 'destroy',
    value: function destroy(record) {
      var id = record[this.idAttribute] ? record[this.idAttribute] : record;
      var key = util.getKey(this.name, id);
      record = util.toJSON(this.storageAdaptor.getItem(key));

      this.storageAdaptor.removeItem(key);

      var index = this.ids.indexOf(id + '');
      if (index != -1) this.ids.splice(index, 1);
      this.storageAdaptor.setItem(this.name, this.ids.join(","));

      return record;
    }
  }, {
    key: 'destroyAll',
    value: function destroyAll(criteria) {
      this.refresh();

      for (var i = this.ids.length - 1; i >= 0; i--) {
        var id = this.ids[i];
        var key = util.getKey(this.name, id);

        if (criteria) {
          var record = util.toJSON(this.storageAdaptor.getItem(key));
          var match = util.findMatch(criteria, record);

          if (match) {
            this.storageAdaptor.removeItem(key);
            this.ids.splice(i, 1);
          }
        } else {
          this.storageAdaptor.removeItem(key);
        }
      }

      if (criteria) {
        this.storageAdaptor.setItem(this.name, this.ids.join(","));
      } else {
        this.storageAdaptor.removeItem(this.name);
        this.ids = [];
        this.store = null;
      }
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var store = this.storageAdaptor.getItem(this.name);

      if (this.store && this.store === store) {
        return;
      }

      this.ids = store && store.split(",") || [];
      this.store = store;
    }
  }]);
  return LocalStorageAdaptor;
}(CoreAdaptor);

var MemoryAdaptor = function (_CoreAdaptor) {
  inherits(MemoryAdaptor, _CoreAdaptor);

  function MemoryAdaptor(options) {
    classCallCheck(this, MemoryAdaptor);

    var _this = possibleConstructorReturn(this, (MemoryAdaptor.__proto__ || Object.getPrototypeOf(MemoryAdaptor)).call(this, options));

    _this.store = [];
    _this.ids = [];
    return _this;
  }

  createClass(MemoryAdaptor, [{
    key: 'save',
    value: function save(record) {
      if (!record[this.idAttribute]) {
        record[this.idAttribute] = util.guid();
      }

      var id = record[this.idAttribute];

      if (this.ids.indexOf(id) < 0) {
        this.store.push(record);
        this.ids.push(id);
      }

      return record;
    }
  }, {
    key: 'find',
    value: function find(criteria) {
      var _this2 = this;

      return this.ids.reduce(function (records, id, index) {
        var record = _this2.store[index];

        if (!record) return records;

        if (criteria) {
          var match = util.findMatch(criteria, record);

          if (match) {
            records.push(record);
          }
        } else {
          records.push(record);
        }

        return records;
      }, []);
    }
  }, {
    key: 'get',
    value: function get$$1(id) {
      var index = this.ids.indexOf(id);
      return this.store[index];
    }
  }, {
    key: 'all',
    value: function all() {
      return this.store;
    }
  }, {
    key: 'destroy',
    value: function destroy(record) {
      var id = record[this.idAttribute] ? record[this.idAttribute] : record;
      var index = this.ids.indexOf(id);

      if (index != -1) {
        this.ids.splice(index, 1);
        this.store.splice(index, 1);
      }

      return record;
    }
  }, {
    key: 'destroyAll',
    value: function destroyAll(criteria) {
      if (!criteria) {
        this.store = [];
        this.ids = [];
        return;
      }

      for (var i = this.ids.length - 1; i >= 0; i--) {
        var id = this.ids[i];
        var record = this.store[i];
        var match = util.findMatch(criteria, record);

        if (match) {
          this.store.splice(i, 1);
          this.ids.splice(i, 1);
        }
      }
    }
  }]);
  return MemoryAdaptor;
}(CoreAdaptor);



var adaptors = Object.freeze({
	LocalStorageAdaptor: LocalStorageAdaptor,
	MemoryAdaptor: MemoryAdaptor,
	FileAdaptor: LocalStorageAdaptor
});

function depot(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = Object.assign({
    name: name,
    idAttribute: '_id',
    storageAdaptor: LocalStorageAdaptor
  }, options);

  var depot = new Depot(name, options);
  return depot;
}

depot.adaptors = adaptors;

if (typeof window != 'undefined') {
  window.depot = depot;
}

module.exports = depot;
