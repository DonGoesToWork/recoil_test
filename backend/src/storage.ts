// In-memory storage for simplicity; replace with a database in production
class BackendState {
  private data: Record<string, any[]> = {};
  private changedObjects: Record<string, any> = {};

  set(type: string, id: string, changes: any) {
    const existing = this.data[type]?.find((item) => item.id === id);
    if (existing) {
      Object.assign(existing, changes);
      if (!this.changedObjects[type]) {
        this.changedObjects[type] = {};
      }
      this.changedObjects[type][id] = changes;
    }
  }

  add(type: string, object: any) {
    if (!this.data[type]) {
      this.data[type] = [];
    }
    this.data[type].push(object);
    if (!this.changedObjects[type]) {
      this.changedObjects[type] = {};
    }
    this.changedObjects[type][object.id] = object;
  }

  remove(type: string, id: string) {
    this.data[type] = this.data[type].filter((item) => item.id !== id);
    if (!this.changedObjects[type]) {
      this.changedObjects[type] = {};
    }
    this.changedObjects[type][id] = null; // Indicate removal
  }

  getFullStorage() {
    return this.data;
  }

  getChangedObjects() {
    return this.changedObjects;
  }

  clearChanges() {
    this.changedObjects = {};
  }
}

export default BackendState;
