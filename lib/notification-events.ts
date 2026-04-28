import { EventEmitter } from 'events';

export const notificationEmitter = new EventEmitter();

// Optional: Limit memory usage by removing listeners after some time
notificationEmitter.setMaxListeners(100);
