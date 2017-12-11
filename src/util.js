function toJSON(str) {
  return str && JSON.parse(str);
}

function toString(data) {
  return data && JSON.stringify(data);
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16).substring(1);
}

function guid() {
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function findMatch(criteria, record) {
  let match = true;

  if (typeof criteria == 'function') {
    match = criteria(record);
  }
  else {
    for (let attr in criteria) {
      match &= (criteria[attr] === record[attr]);
    }
  }

  return match;
}

function getKey(name, id) {
  return `${name}-${id}`;
}

export default {
  toJSON,
  guid,
  findMatch,
  getKey,
  toString
};
