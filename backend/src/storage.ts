// In-memory storage for simplicity; replace with a database in production
class BackendState {
  private data: Record<string, any[]> = {};

  set(type: string, id: string, changes: any) {
    const existing = this.data[type]?.find((item) => item.id === id);
    if (existing) {
      Object.assign(existing, changes);
    }
  }

  add(type: string, object: any) {
    if (!this.data[type]) {
      this.data[type] = [];
    }
    this.data[type].push(object);
  }

  remove(type: string, id: string) {
    this.data[type] = this.data[type].filter((item) => item.id !== id);
  }

  getFullStorage() {
    let objArr = [];

    for (const [key, value] of Object.entries(this.data)) {
      for (const v of value) {
        objArr.push({ messageType: "add", objectType: key, object: v });
      }
    }

    return objArr;
  }
}

export default BackendState;
