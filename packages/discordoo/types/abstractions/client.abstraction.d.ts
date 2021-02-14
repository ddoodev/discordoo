/// <reference types="node" />
import { EventEmitter } from 'events';
export default abstract class ClientAbstraction extends EventEmitter {
    protected constructor();
}
