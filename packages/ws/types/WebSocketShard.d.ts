/// <reference types="node" />
import EventEmitter from 'events'
import WebSocketManager from './WebSocketManager'
export default class WebSocketShard extends EventEmitter {
    manager: WebSocketManager;
    id: number;
    constructor(manager: WebSocketManager, id: number);
}
