"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var Scroll = require("react-scroll");
var message_1 = require("../actions/message");
var utils_1 = require("../utils");
function fetchMessages() {
    var state, _a, messages, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                return [4 /*yield*/, effects_1.call(function () {
                        return state.room.room.getMessages({
                            limit: state.message.messagesLimit,
                            offset: state.message.messagesOffset,
                        });
                    })];
            case 2:
                _a = _b.sent(), messages = _a.messages, error = _a.error;
                if (!error) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.put(message_1.messagesFetchRequestFailureActionCreator(error))];
            case 3:
                _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, effects_1.put(message_1.messagesFetchRequestSuccessActionCreator(messages))];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}
function sendMessages() {
    var state, _a, messageIds, error, messages, i;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                return [4 /*yield*/, effects_1.call(function () {
                        return (_a = state.user.user).sendMessages.apply(_a, state.message.createMessages);
                        var _a;
                    })];
            case 2:
                _a = _b.sent(), messageIds = _a.messageIds, error = _a.error;
                if (!error) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.put(message_1.messagesSendRequestFailureActionCreator(error))];
            case 3:
                _b.sent();
                return [3 /*break*/, 6];
            case 4:
                if (!messageIds) return [3 /*break*/, 6];
                messages = state.message.createMessages.slice();
                for (i = 0; i < messages.length; i++) {
                    messages[i].messageId = messageIds[i];
                    messages[i].created = utils_1.date2ISO3339String(new Date());
                }
                return [4 /*yield*/, effects_1.put(message_1.messageSendRequestSuccessActionCreator(messages))];
            case 5:
                _b.sent();
                Scroll.animateScroll.scrollToBottom({ duration: 300 });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}
function messageSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeLatest(message_1.MESSAGES_FETCH_REQUEST, fetchMessages)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.takeLatest(message_1.MESSAGES_SEND_REQUEST, sendMessages)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.messageSaga = messageSaga;
//# sourceMappingURL=message.js.map