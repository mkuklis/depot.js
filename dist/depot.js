module.exports=class{constructor(t,r){this.adaptor=new r.storageAdaptor(r)}save(t){return this.adaptor.save(t)}saveAll(t){return t.forEach(t=>this.adaptor.save(t)),this.all()}update(t,r){return this.adaptor.update(t,r)}updateAll(t){return this.adaptor.updateAll(t)}find(t){return this.adaptor.find(t)}get(t){return this.adaptor.get(t)}all(){return this.adaptor.all()}destroy(t){return this.adaptor.destroy(t)}destroyAll(t){return this.adaptor.destroyAll(t)}size(){return this.adaptor.size()}};
//# sourceMappingURL=depot.js.map
