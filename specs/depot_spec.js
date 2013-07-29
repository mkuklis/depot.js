describe('depot', function () {

  beforeEach(function () {
    this.store = depot('todos');
    this.todo1 = this.store.save({ title: 'todo1' });
    this.todo2 = this.store.save({ title: 'todo2' });

    this.store2 = depot('todos');
  });

  afterEach(function () {
    this.store.destroyAll();
  });

  it("should accept configurable id attribute", function () {
    this.store = depot('todos', { idAttribute: 'id' });
    var todo = this.store.save({ title: 'todo3' });

    var result = this.store.get(todo.id);
    expect(result).to.be.ok;

    this.store.destroy(todo.id);
    var todos = this.store.all();
    expect(todos.length).to.equal(2);
  });

  it('should support sessionStorage', function() {
    this.store = depot('todos', { storageType: sessionStorage });
    var todo = this.store.save({ title: 'todo3' });

    var result = this.store.get(todo._id);
    expect(result.title).to.equal('todo3');
    expect(result).to.be.ok;
  });

  it('should support a simple object for storage', function() {
    var storeObj = {
      store: {},
      setItem: function(key, value) {
        this.store[key] = value;
      },
      getItem: function(key) {
        return this.store[key];
      },
      removeItem: function(key) {
        delete this.store[key];
      }
    };

    this.store = depot('todos', { storageType: storeObj });
    var todo = this.store.save({ title: 'todo3' });
    var result = this.store.get(todo._id);
    expect(result.title).to.equal('todo3');
  });

  describe("#save", function () {
    it("should save new records", function () {
      this.store.save({ title: 'todo3' });
      this.store.save({ title: 'todo4' });

      var todos = this.store.all();

      expect(todos.length).to.equal(4);
      expect(todos[2])
        .to.have.property('title')
        .and.to.equal("todo3");
    });

    it("should update single record", function () {
      this.todo1.completed = true;
      this.store.save(this.todo1);
      var todos = this.store.all();

      expect(todos[0])
        .to.have.property('completed')
        .and.to.equal(true);
    });

    it("should be safe to use across multiple instances", function () {
      this.store.save({ title: 'todo3' });

      var todos2 = this.store2.all();

      expect(todos2.length).to.equal(3);
      expect(todos2[2])
        .to.have.property('title')
        .and.to.equal("todo3");
    });
  });

  describe("#update", function() {
    it("should update existing record", function() {
      this.store.update({ _id: this.todo1._id, completed: true });
      var todo = this.store.get(this.todo1._id);

      expect(todo)
        .to.have.property('completed')
        .and.to.equal(true);
    });

    it("should update existing record by id", function () {
      this.store.update(this.todo1._id, { completed: true });
      var todo = this.store.get(this.todo1._id);

      expect(todo)
        .to.have.property('completed')
        .and.to.equal(true);
    });
  });

  describe("#updateAll", function () {
    it("should update existing records", function () {
      this.store.updateAll({ completed: true });

      var todos = this.store.all();

      expect(todos[0])
        .to.have.property('completed')
        .and.to.equal(true);

      expect(todos[1])
        .to.have.property('completed')
        .and.to.equal(true);
    });
  });

  describe("#get", function () {
    it("should return record by id", function () {
      var todo = this.store.get(this.todo1._id);

      expect(todo)
        .to.have.property('title')
        .and.to.equal("todo1");
    });
  });

  describe("#destroy", function () {
    it("should destroy single record", function () {
      this.store.destroy(this.todo1);
      var todos = this.store.all();
      expect(todos.length).to.equal(1);
    });

    it("should destroy single record by id", function () {
      this.store.destroy(this.todo1._id);
      var todos = this.store.all();
      expect(todos.length).to.equal(1);
    });

    it("should return destroyed record", function () {
      var todo = this.store.destroy(this.todo1);
      expect(todo).to.eql(this.todo1);
    });
  });

  describe("#destroyAll", function () {
    it("should destroy all records", function () {
      this.store.destroyAll();
      var todos = this.store.all();
      expect(todos.length).to.equal(0);
    });

    it("should only destroy todo records", function () {
      var projectStore = depot('projects');
      projectStore.save({ name: "project1" });

      this.store.destroyAll();
      var todos = this.store.all();
      expect(todos.length).to.equal(0);

      var projects = projectStore.all();
      expect(projects.length).to.equal(1);
      projectStore.destroyAll();
    });

    it("should destroy records based on hash criteria", function () {
      this.store.save({ title: 'todo3', completed: true });
      this.store.save({ title: 'todo4', completed: true });

      var todos = this.store.all();
      expect(todos.length).to.equal(4);

      this.store.destroyAll({ completed: true });

      var todos = this.store.all();
      expect(todos.length).to.equal(2);
    });

    it("should destroy records based on function", function () {
      this.store.save({ title: 'todo3', completed: true });
      this.store.save({ title: 'todo4', completed: true });

      var todos = this.store.all();
      expect(todos.length).to.equal(4);

      this.store.destroyAll(function (record) {
        return record.completed && record.title == "todo3";
      });

      var todos = this.store.all();
      expect(todos.length).to.equal(3);
    });
  });

  describe("#all", function () {
    it("should return all records", function () {
      var todos = this.store.all();
      expect(todos.length).to.equal(2);
    });
  });

  describe("#find", function () {
    it("should find records for given hash criteria", function () {
      this.store.save({ title: 'todo3', completed: true });
      this.store.save({ title: 'todo4', completed: true });

      var todos = this.store.find({ completed: true });

      expect(todos.length).to.equal(2);
    });

    it("should find records for given function", function () {
      var todo3 = this.store.save({ title: 'todo3', completed: true });
      this.store.save({ title: 'todo4', completed: true });

      var todos = this.store.find(function (record) {
        return record.completed && record.title == "todo3";
      });

      expect(todos.length).to.equal(1);
      expect(todos[0]).to.eql(todo3);
    });

    it("should find records saved in other instances", function () {
      var todo3 = this.store.save({ title: 'todo3', completed: true });
      this.store.save({ title: 'todo4', completed: true });

      var todos2 = this.store2.find(function (record) {
        return record.completed && record.title == "todo3";
      });

      expect(todos2.length).to.equal(1);
      expect(todos2[0]).to.eql(todo3);
    });
  });

  describe("#size", function () {
    it("should return the number of items", function () {
      expect(this.store.size()).to.equal(2);
    });

    it("should be reliable across multiple instances", function () {
      this.store.save({ title: 'todo3' });
      expect(this.store2.size()).to.equal(3);
    });
  });
});
