## depot.js

[![build status](https://secure.travis-ci.org/mkuklis/depot.js.png)](http://travis-ci.org/mkuklis/depot.js)

📦 ![depot.js](http://oi45.tinypic.com/xoiq7l.jpg)

## Description

**depot.js** is a namespaced [localStorage](http://diveintohtml5.info/storage.html) wrapper with a simple API.
There are [other](http://brian.io/lawnchair/) [tools](https://github.com/marcuswestin/store.js/) out there but none
of them had what I was looking for.

## Setup

You can install depot.js via npm:

```js
  npm install depotjs --save
```

or load it directly via `<script src="depot.browser.js"></script>`. The `dist` folder contains the most recent minified browser version `depot.browser.js`.

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
const todos = depot('todos');
```

#### Add new records

`_id` property will be generated as GUID and attached to each new record:

```js
todos.save({ title: "todo1" });
todos.save({ title: "todo2", completed: true });
todos.save({ title: "todo3", completed: true });
```

#### Add multiple records at once

```js
todos.saveAll([ { title: "todo1" }, { title: "todo2" }, { title: "todo3" } ]);
```

#### Update all records

```js
todos.updateAll({ completed: false });
```

#### Return all records

```js
todos.all(); // [{ _id: 1, title "todo1" }, { _id: 2, title: todo2 }]
```

#### Find records

* find based on given criteria

```js
todos.find({ completed: true }); // [{ _id: 2, title: "todo2" }, { _id: 3, title: "todo3" }]
```

* find based on given function

```js
todos.find(record => record.completed && record.title == "todo3"); // [{ _id: 3, title: "todo3" }]
```


#### Return single record by id

```js
todos.get(1); // { _id: 1, title: "todo1" }
```

#### Destroy single record

* by record id

```js
todos.destroy(1);
```

* by record object

```js
todos.destroy(todo);
```

#### Destroy all records

* destroy all

```js
todos.destroyAll();
```

* destroy by given criteria

```js
todos.destroyAll({ completed: true });
```

* destroy by given function

```js
todos.destroyAll(record => record.completed && record.title === "todo3");
```

## Options

You can pass a second parameter to `depot` with additional options.

```js
const todos = depot("todos", options);
```

### Available options:

+ idAttribute - used to override record id property (default: `_id`)

```js
const todos = depot("todos", { idAttribute: 'id' });
```

+ storageAdaptor - used to override storage type (default: `localStorage`)

```js
const todos = depot('todos', { storageAdaptor: sessionStorage });
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
