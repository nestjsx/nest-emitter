import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';

interface AppEvents {
  notification: string;
  newRequest: (req: Express.Request) => void;
}
export type MyEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;
