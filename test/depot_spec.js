import depot from '../src/index';

describe('depot', function () {
  let store;
  let todo1;
  let todo2;
  let store2;

  beforeEach(function () {
    store = depot('todos');
    todo1 = store.save({ title: 'todo1' });
    todo2 = store.save({ title: 'todo2' });
    store2 = depot('todos');
  });

  afterEach(function () {
    store.destroyAll();
    store2.destroyAll();
  });

  it("should accept configurable id attribute", function () {
    store = depot('todos', { idAttribute: 'id' });
    const todo = store.save({ title: 'todo3' });

    const result = store.get(todo.id);
    expect(result).toBeTruthy();

    store.destroy(todo.id);
    const todos = store.all();
    expect(todos.length).toEqual(2);
  });

  it('should support sessionStorage', function () {
    store = depot('todos');
    const todo = store.save({ title: 'todo3' });

    const result = store.get(todo._id);
    expect(result.title).toEqual('todo3');
    expect(result).toBeTruthy();
  });

  it('should support a simple object for storage', function () {
    const storeObj = {
      store: {},
      setItem: (key, value) => {
        store[key] = value;
      },
      getItem: (key) => {
        return store[key];
      },
      removeItem: (key) => {
        delete store[key];
      }
    };

    store = depot('todos', { storageAdaptor: depot.adaptors.MemoryAdaptor });
    const todo = store.save({ title: 'todo3' });
    const result = store.get(todo._id);
    expect(result.title).toEqual('todo3');
  });

  describe("#save", function () {
    it("should save new records", function () {
      store.save({ title: 'todo3' });
      store.save({ title: 'todo4' });

      const todos = store.all();

      expect(todos.length).toEqual(4);
      expect(todos[2]).toHaveProperty('title', 'todo3')
    });

    it("should update single record", function () {
      todo1.completed = true;
      store.save(todo1);

      const todos = store.all();

      expect(todos[0]).toHaveProperty('completed', true);
    });

    it("should be safe to use across multiple instances", function () {
      store.save({ title: 'todo3' });

      const todos2 = store2.all();

      expect(todos2.length).toEqual(3);
      expect(todos2[2]).toHaveProperty('title', 'todo3')
    });
  });

  describe("#saveAll", function () {
    it("should save all new records", function () {
      store.destroyAll();
      const todos = store.saveAll([ { title: 'todo 1' }, { title: 'todo 2'} ]);
      expect(todos.length).toEqual(2);
    });
  });

  describe("#update", function () {
    it("should update existing record", function () {
      store.update({ _id: todo1._id, completed: true });
      const todo = store.get(todo1._id);

      expect(todo).toHaveProperty('completed', true);
    });

    it("should update existing record by id", function () {
      store.update(todo1._id, { completed: true });
      const todo = store.get(todo1._id);

      expect(todo).toHaveProperty('completed', true);
    });
  });

  describe("#updateAll", function () {
    it("should update existing records", function () {
      store.updateAll({ completed: true });

      const todos = store.all();

      expect(todos[0])
        .toHaveProperty('completed', true);

      expect(todos[1])
        .toHaveProperty('completed', true);
    });
  });

  describe("#get", function () {
    it("should return record by id", function () {
      const todo = store.get(todo1._id);

      expect(todo)
        .toHaveProperty('title', 'todo1');
    });
  });

  describe("#destroy", function () {
    it("should destroy single record", function () {
      store.destroy(todo1);
      const todos = store.all();
      expect(todos.length).toEqual(1);
    });

    it("should destroy single record by id", function () {
      store.destroy(todo1._id);
      const todos = store.all();
      expect(todos.length).toEqual(1);
    });

    it("should return destroyed record", function () {
      const todo = store.destroy(todo1);
      expect(todo).toEqual(todo1);
    });
  });

  describe("#destroyAll", function () {
    it("should destroy all records", function () {
      store.destroyAll();
      const todos = store.all();
      expect(todos.length).toEqual(0);
    });

    it("should only destroy todo records", function () {
      const projectStore = depot('projects');
      projectStore.save({ name: "project1" });

      store.destroyAll();
      const todos = store.all();
      expect(todos.length).toEqual(0);

      const projects = projectStore.all();
      expect(projects.length).toEqual(1);
      projectStore.destroyAll();
    });

    it("should destroy records based on hash criteria", function () {
      store.save({ title: 'todo3', completed: true });
      store.save({ title: 'todo4', completed: true });

      let todos = store.all();
      expect(todos.length).toEqual(4);

      store.destroyAll({ completed: true });

      todos = store.all();
      expect(todos.length).toEqual(2);
    });

    it("should destroy records based on function", function () {
      store.save({ title: 'todo3', completed: true });
      store.save({ title: 'todo4', completed: true });

      let todos = store.all();
      expect(todos.length).toEqual(4);

      store.destroyAll(record =>
        record.completed && record.title == "todo3"
      );

      todos = store.all();
      expect(todos.length).toEqual(3);
    });
  });

  describe("#all", function () {
    it("should return all records", function () {
      const todos = store.all();
      expect(todos.length).toEqual(2);
    });
  });

  describe("#find", function () {
    it("should find records for given hash criteria", function () {
      store.save({ title: 'todo3', completed: true });
      store.save({ title: 'todo4', completed: true });

      const todos = store.find({ completed: true });

      expect(todos.length).toEqual(2);
    });

    it("should find records for given function", function () {
      const todo3 = store.save({ title: 'todo3', completed: true });
      store.save({ title: 'todo4', completed: true });

      const todos = store.find(record =>
        record.completed && record.title == "todo3"
      );

      expect(todos.length).toEqual(1);
      expect(todos[0]).toEqual(todo3);
    });

    it("should find records saved in other instances", function () {
      const todo3 = store.save({ title: 'todo3', completed: true });
      store.save({ title: 'todo4', completed: true });

      const todos2 = store2.find(record =>
        record.completed && record.title == "todo3");

      expect(todos2.length).toEqual(1);
      expect(todos2[0]).toEqual(todo3);
    });
  });

  describe("#size", function () {
    it("should return the number of items", function () {
      expect(store.size()).toEqual(2);
    });

    it("should be reliable across multiple instances", function () {
      store.save({ title: 'todo3' });
      expect(store2.size()).toEqual(3);
    });
  });
});
