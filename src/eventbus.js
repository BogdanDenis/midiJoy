let eventBus = require('js-event-bus');

class EventBus {
  static _instance = null;

  static getInstance() {
    if (EventBus._instance) {
      return EventBus._instance;
    }

    EventBus._instance = new eventBus();

    return EventBus._instance;
  }
}

export { EventBus };
