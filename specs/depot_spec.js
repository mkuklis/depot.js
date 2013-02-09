describe('depot', function () {

  beforeEach(function () {
    this.store = depot('todos');
    this.store.destroyAll(); 
    this.todo1 = this.store.save({ title: 'todo1' });
    this.todo2 = this.store.save({ title: 'todo2' });
  });

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

  it("should return record by id", function () {
    var todo = this.store.get(this.todo1.id);
    expect(todo)
      .to.have.property('title')
      .and.to.equal("todo1");
  });

  it("should destroy single record", function () {
    this.store.destroy(this.todo1);
    var todos = this.store.all();
    expect(todos.length).to.equal(1);
  });

  it("should destroy single record by id", function () {
    this.store.destroy(this.todo1.id);
    var todos = this.store.all();
    expect(todos.length).to.equal(1);
  });

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
  });

  it("should return all records", function () {
    var todos = this.store.all();
    expect(todos.length).to.equal(2);
  });

  it("should find records for given criteria", function () {
    this.store.save({ title: 'todo3', completed: true });
    this.store.save({ title: 'todo4', completed: true });
    
    var todos = this.store.find({ completed: true });

    expect(todos.length).to.equal(2);
  });
});
