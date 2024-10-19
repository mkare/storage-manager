type EventHandler = (...args: any[]) => void;

class EventEmitter {
  private events: { [key: string]: EventHandler[] } = {};

  on(event: string, handler: EventHandler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((handler) => handler(...args));
    }
  }

  off(event: string, handler: EventHandler) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((h) => h !== handler);
  }
}

export const eventEmitter = new EventEmitter();
