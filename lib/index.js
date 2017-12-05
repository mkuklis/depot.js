// depot.js v1.0.0

// (c) 2017 Michal Kuklis
// Licensed under The MIT License
// http://opensource.org/licenses/MIT

import "babel-core/register";
import "babel-polyfill";

import Depot from "./depot";
import * as adaptors from './adaptors';

function depot(name, options = {}) {
  options = Object.assign({
    name,
    idAttribute: '_id',
    storageAdaptor: adaptors.LocalStorageAdaptor
  }, options);

  return new Depot(name, options);
}

depot.adaptors = adaptors;

if (typeof window != 'undefined') {
  window.depot = depot;
}

export default depot;
