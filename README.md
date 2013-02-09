### Depot.js

![depot.js](http://oi45.tinypic.com/xoiq7l.jpg)

### Description

**depot.js** is a wrapper around [localStorage](http://diveintohtml5.info/storage.html) with a simple API. There are
[other](http://brian.io/lawnchair/) [tools](https://github.com/marcuswestin/store.js/) out there but non of them had what I was looking for. depot.js should work well with CommonJS and AMD loaders. If loaders are not present depot.js will attach itself to the current context (window). 

### API

+ save(record)

+ updateAll(data)

+ find(hash)

+ all()

+ destroy(record or id)

+ destroyAll() 

+ get(id)

###Example Usage

Define new store:

```js
var todoStore = depot('todos');
```

Add new records (id property will be generated and attached to each new record):

```js
todoStore.save({ title: "todo1" });
todoStore.save({ title: "todo2", completed: true });
todoStore.save({ title: "todo3", completed: true });
```

Update all records: 

```js
todoStore.updateAll({ completed: false });
```

Return all records:

```js
todoStore.all(); // [{ id: 1, title "todo1" }, {id: 2, title: todo2 }]
```

Find records for given criteria:

```js
todoStore.find({ completed: true }); // [{ id: 2, title: "todo2" }, { id: 3, title: "todo3" }]
```

Return single record by id:

```js
todoStore.get(1); // { id: 1, title: "todo1" }
```

Destroy single record:

```js
// pass id
todoStore.destroy(1);
// or record
todoStore.destroy(todo);
```

Destroy all records:

```js
todoStore.destroyAll();
```


##License:
<pre>
The MIT License
</pre>
