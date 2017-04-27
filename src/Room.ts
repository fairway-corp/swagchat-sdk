import * as model from "./interface";
import { Client } from "./Client";
import { createQueryParams } from "./util";
import "isomorphic-fetch";

export default class Room {
    private _client: Client;
    private _data: model.IRoom;
    private _onMessageReceived: Function;
    private _onUserJoined: Function;
    private _onUserLeft: Function;

    constructor(option: model.IRoomConfig) {
        this._client = option.client;
        this._data = option.roomObj;
    }

    get roomId(): string {
        return this._data.roomId;
    }

    set roomId(roomId: string) {
        this._data.roomId = roomId;
    }

    get name(): string {
        return this._data.name;
    }

    set name(name: string) {
        this._data.name = name;
    }

    get pictureUrl(): string {
        return this._data.pictureUrl;
    }

    set pictureUrl(pictureUrl: string) {
        this._data.pictureUrl = pictureUrl;
    }

    get informationUrl(): string {
        return this._data.informationUrl;
    }

    set informationUrl(informationUrl: string) {
        this._data.informationUrl = informationUrl;
    }

    get metaData(): {[key: string]: string | number | boolean | Object} {
        return this._data.metaData;
    }

    set metaData(metaData: {[key: string]: string | number | boolean | Object}) {
        if (!metaData || typeof(metaData) !== "object") {
            throw Error("Set metaData failure. metaData is not setting.");
        }
        this._data.metaData = metaData;
    }

    get isPublic(): boolean {
        return this._data.isPublic;
    }

    set isPublic(isPublic: boolean) {
        this._data.isPublic = isPublic;
    }

    get created(): number {
        return this._data.created;
    }

    get modified(): number {
        return this._data.modified;
    }

    get users(): model.IUserForRoom[] {
        return this._data.users;
    }

    public setMetaData(key: string, value: string | number | boolean | Object) {
        if (!key || typeof(key) !== "string") {
            throw Error("set metaData failure. Parameter invalid.");
        }
        if (this._data.metaData === undefined) {
            let metaData = {key: value};
            this._data.metaData = metaData;
        } else {
            this._data.metaData[key] = value;
        }
    }

    public update(): Promise<Response> {
        const self = this;
        return fetch(this._client.apiEndpoint + "/rooms/" + this._data.roomId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this._data)
        }).then((response: Response) => response.json())
        .then((json) => {
            if (json.hasOwnProperty("errorName")) {
                throw Error(JSON.stringify(json));
            }
            self._data = <model.IRoom>json;
        }).catch((error) => {
            throw Error(error.message);
        });
    }

    public setUsers(userIds: string[]) {
        if (!userIds || !Array.isArray(userIds)) {
            throw Error("setUsers failure. Parameter invalid.");
        }
        let fetchParam = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userIds: userIds
            })
        };
        if (!(userIds instanceof Array) || userIds.length === 0) {
            fetchParam.body = JSON.stringify({});
        }
        return fetch(this._client.apiEndpoint + "/rooms/" + this._data.roomId + "/users", fetchParam).then((response: Response) => response.json())
        .then((json) => {
            if (json.hasOwnProperty("errorName")) {
                throw Error(JSON.stringify(json));
            }
            return json;
        }).catch((error) => {
            throw Error(error.message);
        });
    }

    public addUsers(userIds: string[]) {
        if (!userIds || !Array.isArray(userIds)) {
            throw Error("addUsers failure. Parameter invalid.");
        }
        let fetchParam = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userIds: userIds
            })
        };
        if (!(userIds instanceof Array) || userIds.length === 0) {
            fetchParam.body = JSON.stringify({});
        }
        return fetch(this._client.apiEndpoint + "/rooms/" + this._data.roomId + "/users", fetchParam).then((response: Response) => response.json())
        .then((json) => {
            if (json.hasOwnProperty("errorName")) {
                throw Error(JSON.stringify(json));
            }
        }).catch((error) => {
            throw Error(error.message);
        });
    }

    public removeUsers(userIds: string[]) {
        if (!userIds || !Array.isArray(userIds)) {
            throw Error("removeUsers failure. Parameter invalid.");
        }
        let fetchParam = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userIds: userIds
            })
        };
        if (!(userIds instanceof Array) || userIds.length === 0) {
            fetchParam.body = JSON.stringify({});
        }
        return fetch(this._client.apiEndpoint + "/rooms/" + this._data.roomId + "/users", fetchParam).then((response: Response) => response.json())
        .then((json) => {
            if (json.hasOwnProperty("errorName")) {
                throw Error(JSON.stringify(json));
            }
        }).catch((error) => {
            throw Error(error.message);
        });
    }

    public reflesh(): Promise<Response> {
        const self = this;
        return fetch(this._client.apiEndpoint + "/rooms/" + this._data.roomId, {
        }).then((response: Response) => response.json())
        .then((json) => {
            if (json.hasOwnProperty("errorName")) {
                throw Error(JSON.stringify(json));
            }
            self._data = <model.IRoom>json;
        }).catch((error) => {
            throw Error(error.message);
        });
    }

    public getMessages(queryParams: {[key: string]: string}): Promise<Response> {
        let queryParamsString = "";
        if (queryParams !== undefined) {
            queryParamsString = createQueryParams(queryParams);
        }
        return fetch(this._client.apiEndpoint + "/rooms/" + this._data.roomId + "/messages?" + queryParamsString, {
        }).then((response: Response) => response.json())
        .then((json) => {
            if (json.hasOwnProperty("errorName")) {
                throw Error(JSON.stringify(json));
            }
            return json;
        }).catch((error) => {
            throw Error(error.message);
        });
    }

    public subscribeMessage(onMessageReceived: Function) {
        if (!this._data.roomId || typeof(this._data.roomId) !== "string") {
            throw Error("Subscribe message failure. roomId is not setting.");
        }
        if (onMessageReceived === undefined) {
            throw Error("Subscribe message failure. Parameter invalid.");
        }
        this._onMessageReceived = onMessageReceived;
        if (this._client.connection.sendEvent(this._data.roomId, "message", "bind")) {
            this._client.connection.onMessageReceived = (data: model.IMessage) => {
                this._onMessageReceived(data);
            };
            console.info("Subscribe message success roomId[" + this._data.roomId + "]");
        } else {
            throw Error("Subscribe message failure roomId[" + this._data.roomId + "]");
        }
    }

    public unsubscribeMessage(): void {
        if (!this._data.roomId || typeof(this._data.roomId) !== "string") {
            throw Error("Unsubscribe message failure. roomId is not setting.");
        }
        this._onMessageReceived = Function;
        if (this._client.connection.sendEvent(this._data.roomId, "message", "unbind")) {
            console.info("Unsubscribe message success roomId[" + this._data.roomId + "]");
        } else {
            throw Error("Unsubscribe message failure roomId[" + this._data.roomId + "]");
        }
    }

    public subscribeUserJoin(onUserJoined: Function) {
        if (!this._data.roomId || typeof(this._data.roomId) !== "string") {
            throw Error("Subscribe userJoin failure. roomId is not setting.");
        }
        if (onUserJoined === undefined) {
            throw Error("Subscribe userJoin failure. Parameter invalid.");
        }
        this._onUserJoined = onUserJoined;
        if (this._client.connection.sendEvent(this._data.roomId, "userJoin", "bind")) {
            this._client.connection.onUserJoined = (data: model.IMessage) => {
                let users = <model.IUserForRoom[]>data.payload;
                this._data.users = users;
                this._onUserJoined(users);
            };
            console.info("Subscribe userJoin success roomId[" + this._data.roomId + "]");
        } else {
            throw Error("Subscribe userJoin failure roomId[" + this._data.roomId + "]");
        }
    }

    public unsubscribeUserJoin(): void {
        if (!this._data.roomId || typeof(this._data.roomId) !== "string") {
            throw Error("Unsubscribe userJoin failure. roomId is not setting.");
        }
        this._onUserJoined = Function;
        if (this._client.connection.sendEvent(this._data.roomId, "userJoin", "unbind")) {
            console.info("Unsubscribe userJoin success roomId[" + this._data.roomId + "]");
        } else {
            throw Error("Unsubscribe userJoin failure roomId[" + this._data.roomId + "]");
        }
    }

    public subscribeUserLeft(onUserLeft: Function) {
        if (!this._data.roomId || typeof(this._data.roomId) !== "string") {
            throw Error("Subscribe userLeft failure. roomId is not setting.");
        }
        if (onUserLeft === undefined) {
            throw Error("Subscribe userLeft failure. Parameter invalid.");
        }
        this._onUserLeft = onUserLeft;
        if (this._client.connection.sendEvent(this._data.roomId, "userLeft", "bind")) {
            this._client.connection.onUserLeft = (data: model.IMessage) => {
                let users = <model.IUserForRoom[]>data.payload;
                this._data.users = users;
                this._onUserLeft(users);
            };
            console.info("Subscribe userLeft success roomId[" + this._data.roomId + "]");
        } else {
            throw Error("Subscribe userLeft failure roomId[" + this._data.roomId + "]");
        }
    }

    public unsubscribeUserLeft(): void {
        if (!this._data.roomId || typeof(this._data.roomId) !== "string") {
            throw Error("Unsubscribe userLeft failure. roomId is not setting.");
        }
        if (this._onUserLeft === undefined) {
            throw Error("Unsubscribe userLeft failure. .");
        }
        this._onUserLeft = Function;
        if (this._client.connection.sendEvent(this._data.roomId, "userLeft", "unbind")) {
            console.info("Unsubscribe userLeft success roomId[" + this._data.roomId + "]");
        } else {
            throw Error("Unsubscribe userLeft failure roomId[" + this._data.roomId + "]");
        }
    }
}