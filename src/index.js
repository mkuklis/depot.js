import Depot from "./depot";
import * as adaptors from './adaptors';

function depot(name, options = {}) {
  options = Object.assign({
    name,
    idAttribute: '_id',
    storageAdaptor: adaptors.LocalStorageAdaptor
  }, options);

  const depot = new Depot(name, options);
  return depot;
}

depot.adaptors = adaptors;

if (typeof window != 'undefined') {
  window.depot = depot;
}

export default depot;
