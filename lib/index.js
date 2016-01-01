// depot.js v1.0.0

// (c) 2015 Michal Kuklis
// Licensed under The MIT License
// http://opensource.org/licenses/MIT

"use strict";

import "babel-core/register";
import "babel-polyfill";

import Depot from "./depot";
import util from  "./util";
import * as adaptors from './adaptors';

function depot(name, options = {}) {
  options = util.extend({
    name,
    idAttribute: '_id',
    storageAdaptor: adaptors.LocalStorageAdaptor
  }, options);

  let depot = new Depot(name, options);

  return depot;
}

depot.adaptors = adaptors;

if (typeof window != 'undefined') {
	window.depot = depot;
}

export default depot;