### Depot.js

[![build status](https://secure.travis-ci.org/mkuklis/depot.js.png)](http://travis-ci.org/mkuklis/depot.js)

![depot.js](http://oi45.tinypic.com/xoiq7l.jpg)

### Description

**depot.js** is a namespaced [localStorage](http://diveintohtml5.info/storage.html) wrapper with a simple API.
There are [other](http://brian.io/lawnchair/) [tools](https://github.com/marcuswestin/store.js/) out there but none 
of them had what I was looking for. depot.js should work well with CommonJS and AMD loaders. 
If loaders are not present depot.js will attach itself to the current context (window). 

### API

+ save(record)

+ updateAll(hash)

+ find(object | function)

+ all()

+ destroy(id | hash)

+ destroyAll(none | hash | function) 

+ get(id)

###Usage

####Define new store

```js
var todoStore = depot('todos');
```

####Add new records

`_id` property will be generated and attached to each new record:

```js
todoStore.save({ title: "todo1" });
todoStore.save({ title: "todo2", completed: true });
todoStore.save({ title: "todo3", completed: true });
```

####Update all records

```js
todoStore.updateAll({ completed: false });
```

####Return all records

```js
todoStore.all(); // [{ id: 1, title "todo1" }, {id: 2, title: todo2 }]
```

####Find records 

* find based on given criteria

```js
todoStore.find({ completed: true }); // [{ id: 2, title: "todo2" }, { id: 3, title: "todo3" }]
```

* find based on given function

```js
todoStore.find(function (record) {
  return record.completed && record.title == "todo3";
}); // [{ id: 3, title: "todo3" }]
```


####Return single record by id

```js
todoStore.get(1); // { id: 1, title: "todo1" }
```

####Destroy single record:

* by record id
 
```js
todoStore.destroy(1);
```

* by record object

```js
todoStore.destroy(todo);
```

####Destroy all records

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
todoStore.destroyAll(function (record) {
  return record.completed && record.title == "todo3"; 
});
```

###Options

You can pass a second parameter to depo.js with additional options.

```js
var todoStore = depot("todos", options);
```

Currently the only option available is `idAttribute`
which can be used to override default record id (_id) property:

```js
var todoStore = depot("todos", { idAttribute: 'id' });
```

###Contributors:

* [@mkuklis](http://github.com/mkuklis)
* [@scttnlsn](http://github.com/scttnlsn)


###License:
<pre>
The MIT License
</pre>
