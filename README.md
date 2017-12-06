## depot.js

[![build status](https://secure.travis-ci.org/mkuklis/depot.js.png)](http://travis-ci.org/mkuklis/depot.js)

![depot.js](http://oi45.tinypic.com/xoiq7l.jpg)


## Description

**depot.js** is a namespaced [localStorage](http://diveintohtml5.info/storage.html) wrapper with a simple API.
There are [other](http://brian.io/lawnchair/) [tools](https://github.com/marcuswestin/store.js/) out there but none
of them had what I was looking for.


## Setup

You can install depot.js via npm:

```js
  npm install depotjs --save
```

or load it directly via `<script src="depot.js"></script>`. The `dist` folder contains the most recent minified version.

## Dependencies

depot.js does not depend on any other libraries however if you plan to support older browsers you will need to include [ES5-shim](https://github.com/kriskowal/es5-shim).

If you plan to run it on browsers that don't support [localStorage](http://diveintohtml5.info/storage.html) you may try to include [storage polyfill](https://gist.github.com/remy/350433).

## API

+ save(record)

+ saveAll(array)

+ updateAll(hash)

+ update(hash)

+ find(hash | function)

+ all()

+ destroy(id | record)

+ destroyAll(none | hash | function)

+ get(id)

+ size()

## Usage

#### Import depot

```js
import depot from 'depotjs';
```

#### Define new store

```js
const todoStore = depot('todos');
```

#### Add new records

`_id` property will be generated as GUID and attached to each new record:

```js
todoStore.save({ title: "todo1" });
todoStore.save({ title: "todo2", completed: true });
todoStore.save({ title: "todo3", completed: true });
```

#### Update all records

```js
todoStore.updateAll({ completed: false });
```

#### Return all records

```js
todoStore.all(); // [{ _id: 1, title "todo1" }, { _id: 2, title: todo2 }]
```

#### Find records

* find based on given criteria

```js
todoStore.find({ completed: true }); // [{ _id: 2, title: "todo2" }, { _id: 3, title: "todo3" }]
```

* find based on given function

```js
todoStore.find(record => record.completed && record.title == "todo3"); // [{ _id: 3, title: "todo3" }]
```


#### Return single record by id

```js
todoStore.get(1); // { _id: 1, title: "todo1" }
```

#### Destroy single record

* by record id

```js
todoStore.destroy(1);
```

* by record object

```js
todoStore.destroy(todo);
```

#### Destroy all records

* destroy all

```js
todoStore.destroyAll();
```

* destroy by given criteria

```js
todoStore.destroyAll({ completed: true });
```

* destroy by given function

```js
todoStore.destroyAll(record => record.completed && record.title === "todo3");
```

## Options

You can pass a second parameter to depot.js with additional options.

```js
const todoStore = depot("todos", options);
```

### Available options:

+ idAttribute - used to override record id property (default: `_id`)

```js
const todoStore = depot("todos", { idAttribute: 'id' });
```

+ storageAdaptor - used to override storage type (default: `localStorage`)

```js
const todoStore = depot('todos', { storageAdaptor: sessionStorage });
```


## Contributors:

* [@mkuklis](http://github.com/mkuklis)
* [@scttnlsn](http://github.com/scttnlsn)
* [@chrispitt](http://github.com/chrispitt)
* [@simonsmith](http://github.com/simonsmith)
* [@mdlawson](http://github.com/mdlawson)
* [@jdbartlett](http://github.com/jdbartlett)

## License:
<pre>
The MIT License
</pre>
