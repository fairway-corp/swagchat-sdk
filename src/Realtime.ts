import { isBrowser } from "./const";
import { logger } from "./util";
import * as I from "./interface";

export class Realtime {
    readonly conn: WebSocket;

    public onConnected: Function;
    public onError: Function;
    public onClosed: Function;
    public onMessageReceived: Function;
    public onUserJoined: Function;
    public onUserLeft: Function;

    constructor(endpoint: string) {
        logger("realtime", "info", "Connecting Realtime Server...");

        let websocket = isBrowser ? WebSocket : require("ws");
        this.conn = new websocket(endpoint);
        this.conn.addEventListener("open", (e: Event) => {
            logger("realtime", "info", "Connecting Realtime Server OK");
            if (this.onConnected) {
                this.onConnected(<WebSocket>e.target);
            }
        });
        this.conn.addEventListener("error", (e: Event) => {
            if (this.onError) {
                this.onError(<WebSocket>e.target);
            }
        });
        this.conn.addEventListener("close", (e: I.ICloseEvent) => {
            if (this.onClosed) {
                this.onClosed(e.code, e.reason);
            }
        });
        this.conn.addEventListener("message", (e: I.IMessageEvent) => {
            let message = <I.IMessage>JSON.parse(<string>e.data);
            switch (message.eventName) {
            case "message":
                if (this.onMessageReceived) {
                    this.onMessageReceived(message);
                }
                break;
            case "userJoin":
                if (this.onUserJoined) {
                    this.onUserJoined(message);
                }
                break;
            case "userLeft":
                if (this.onUserLeft) {
                    this.onUserLeft(message);
                }
                break;
            }
        });
    }

    public close() {
        this.conn.close();
    }

    public sendEvent(roomId: string, eventName: string, action: string): Boolean {
        if (this.conn.readyState !== this.conn.OPEN) {
            return false;
        }
        try {
            this.conn.send(JSON.stringify({
                roomId: roomId,
                eventName: eventName,
                action: action
            }));
        } catch (ex) {
            return false;
        }
        return true;
    }
}
