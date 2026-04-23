class AuthEventBus {
  constructor() {
    this.events = new Map();
    this._manualLogout = false; // 👈 internal flag
  }

  on(event, cb) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(cb);

    return () => this.off(event, cb);
  }

  off(event, cb) {
    this.events.get(event)?.delete(cb);
  }

  emit(event, payload) {
    // 👇 mark manual logout
    if (event === "auth:logout") {
      this._manualLogout = true;
    }

    this.events.get(event)?.forEach((cb) => cb(payload));
  }

  // 👇 consume once (important to avoid stale state)
  consumeManualLogout() {
    const value = this._manualLogout;
    this._manualLogout = false;
    return value;
  }

  // (optional) peek without consuming
  isManualLogout() {
    return this._manualLogout;
  }
}

export const authEvents = new AuthEventBus();