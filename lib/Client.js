"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Realtime_1 = require("./Realtime");
var User_1 = require("./User");
var Room_1 = require("./Room");
var const_1 = require("./const");
require("isomorphic-fetch");
var Client = (function () {
    function Client(params) {
        console.info("%c[SwagChat]Initializing API Client...", "color:" + const_1.apiLogColor);
        this.apiKey = params.apiKey;
        this.apiSecret = params.apiSecret || "";
        this.apiEndpoint = params.apiEndpoint;
        this.userAccessToken = params.userAccessToken || "";
        if (params.hasOwnProperty("realtime") && params.realtime.hasOwnProperty("endpoint") && params.realtime.endpoint !== "") {
            var realtimeConfig = params.realtime;
            this.connection = new Realtime_1.default(realtimeConfig.endpoint);
        }
        console.info("%c[SwagChat]Initialized API Client OK", "color:" + const_1.apiLogColor);
    }
    Object.defineProperty(Client.prototype, "onConnected", {
        set: function (callback) {
            this.connection.onConnected = callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "onError", {
        set: function (callback) {
            this.connection.onError = callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "onClosed", {
        set: function (callback) {
            this.connection.onClosed = callback;
        },
        enumerable: true,
        configurable: true
    });
    Client.prototype.getApiHeaders = function () {
        return {
            "X-SwagChat-Api-Key": this.apiKey,
            "X-SwagChat-Api-Secret": this.apiSecret,
        };
    };
    Client.prototype.socketClose = function () {
        this.connection.close();
    };
    Client.prototype.createUser = function (createUserObject) {
        var headers = this.getApiHeaders();
        headers["Content-Type"] = "application/json";
        var self = this;
        return fetch(this.apiEndpoint + "/users", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(createUserObject)
        }).then(function (response) {
            if (response.status === 201) {
                return response.json().then(function (user) {
                    return {
                        user: new User_1.User({
                            client: self,
                            data: user,
                        }),
                        error: null,
                    };
                });
            }
            else {
                return response.json().then(function (json) {
                    return {
                        user: null,
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                user: null,
                error: {
                    title: error.message,
                },
            };
        });
    };
    Client.prototype.getUsers = function () {
        return fetch(this.apiEndpoint + "/users", {
            method: "GET",
            headers: this.getApiHeaders(),
        }).then(function (response) {
            if (response.status === 200) {
                return response.json().then(function (users) {
                    return {
                        users: users,
                        error: null,
                    };
                });
            }
            else {
                return response.json().then(function (json) {
                    return {
                        users: null,
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                users: null,
                error: {
                    title: error.message,
                },
            };
        });
    };
    Client.prototype.getUser = function (userId, accessToken) {
        if (!userId || typeof (userId) !== "string") {
            throw Error("Get user failure. Parameter invalid [userId].");
        }
        var self = this;
        return fetch(this.apiEndpoint + "/users/" + userId, {
            method: "GET",
            headers: this.getApiHeaders(),
        }).then(function (response) {
            if (response.status === 200) {
                return response.json().then(function (user) {
                    user.accessToken = accessToken || "";
                    return {
                        user: new User_1.User({
                            client: self,
                            data: user,
                        }),
                        error: null,
                    };
                });
            }
            else if (response.status === 404) {
                return {
                    user: null,
                    error: {
                        title: response.statusText,
                    },
                };
            }
            else {
                return response.json().then(function (json) {
                    return {
                        user: null,
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                user: null,
                error: {
                    title: error.message,
                },
            };
        });
    };
    Client.prototype.removeUser = function (userId) {
        if (!userId || typeof (userId) !== "string") {
            throw Error("Remove user failure. Parameter invalid.");
        }
        var headers = this.getApiHeaders();
        headers["Content-Type"] = "application/json";
        return fetch(this.apiEndpoint + "/users/" + userId, {
            method: "DELETE",
            headers: headers,
        }).then(function (response) {
            if (response.status === 204) {
                return {
                    error: null,
                };
            }
            else if (response.status === 404) {
                return {
                    error: {
                        title: response.statusText,
                    },
                };
            }
            else {
                return response.json().then(function (json) {
                    return {
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                error: {
                    title: error.message,
                },
            };
        });
    };
    Client.prototype.createRoom = function (createRoomObject) {
        var headers = this.getApiHeaders();
        headers["Content-Type"] = "application/json";
        var self = this;
        return fetch(this.apiEndpoint + "/rooms", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(createRoomObject)
        }).then(function (response) {
            if (response.status === 201) {
                return response.json().then(function (room) {
                    return {
                        room: new Room_1.Room({
                            client: self,
                            data: room,
                        }),
                        error: null,
                    };
                });
            }
            else {
                return response.json().then(function (json) {
                    return {
                        room: null,
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                room: null,
                error: {
                    title: error.message,
                },
            };
        });
    };
    Client.prototype.getRooms = function () {
        return fetch(this.apiEndpoint + "/rooms", {
            method: "GET",
            headers: this.getApiHeaders(),
        }).then(function (response) {
            if (response.status === 200) {
                return response.json().then(function (rooms) {
                    return {
                        rooms: rooms,
                        error: null,
                    };
                });
            }
            else {
                return response.json().then(function (json) {
                    return {
                        rooms: null,
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                rooms: null,
                error: {
                    title: error.message,
                },
            };
        });
    };
    Client.prototype.getRoom = function (roomId) {
        if (!roomId || typeof (roomId) !== "string") {
            throw Error("Get room failure. Parameter invalid.");
        }
        var self = this;
        return fetch(this.apiEndpoint + "/rooms/" + roomId, {
            method: "GET",
            headers: this.getApiHeaders(),
        }).then(function (response) {
            if (response.status === 200) {
                return response.json().then(function (room) {
                    return {
                        room: new Room_1.Room({
                            client: self,
                            data: room
                        }),
                        error: null,
                    };
                });
            }
            else if (response.status === 404) {
                return {
                    room: null,
                    error: {
                        title: response.statusText,
                    },
                };
            }
            else {
                return response.json().then(function (json) {
                    return {
                        room: null,
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                room: null,
                error: {
                    title: error.message,
                },
            };
        });
    };
    Client.prototype.removeRoom = function (roomId) {
        if (!roomId || typeof (roomId) !== "string") {
            throw Error("Remove room failure. Parameter invalid.");
        }
        var headers = this.getApiHeaders();
        headers["Content-Type"] = "application/json";
        return fetch(this.apiEndpoint + "/rooms/" + roomId, {
            method: "DELETE",
            headers: headers,
        }).then(function (response) {
            if (response.status === 204) {
                return {
                    error: null,
                };
            }
            else if (response.status === 404) {
                return {
                    error: {
                        title: response.statusText,
                    },
                };
            }
            else {
                return response.json().then(function (json) {
                    return {
                        error: json,
                    };
                });
            }
        }).catch(function (error) {
            return {
                error: {
                    title: error.message,
                },
            };
        });
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map