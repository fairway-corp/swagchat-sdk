import { Client, User, Room } from ".";

export enum Platform {
  IOS = 1,
  ANDROID = 2,
}

export interface IClientParams {
  apiKey: string;
  apiSecret?: string;
  apiEndpoint: string;
  userAccessToken?: string;
  realtime?: IRealtimeConfig;
}

export interface IRealtimeConfig {
  endpoint: string;
}

export interface IUserParams {
  client: Client;
  data: IUser;
}

export interface IAuthParams {
  apiKey: string;
  apiEndpoint: string;
  realtimeEndpoint?: string;
  userId: string;
  accessToken: string;
}

export interface IDevice {
  userId: string;
  platform: number;
  token: string;
  notificationDeviceId: string;
}

export interface IUser {
  userId: string;
  name: string;
  pictureUrl: string;
  informationUrl: string;
  unreadCount: number;
  metaData: {[key: string]: string | number | boolean | Object};
  isPublic: boolean;
  accessToken: string;
  created: string;
  modified: string;
  rooms: IRoomForUser[];
  devices: IDevice[];
  blockedUsers?: string[];
  mutedRooms?: string[];
}

export interface IRoomForUser {
  roomId: string;
  userId: string;
  name: string;
  pictureUrl: string;
  informationUrl: string;
  metaData: {[key: string]: string | number | boolean | Object};
  isPublic: boolean;
  lastMessage: string;
  lastMessageUpdated: string;
  created: string;
  modified: string;
  ruUnreadCount: number;
  ruMetaData: {[key: string]: string | number | boolean | Object};
  ruCreated: string;
  ruModified: string;
}

export interface IRoomParams {
  client: Client;
  data: IRoom;
}

export interface IRoom {
  roomId: string;
  userId: string;
  name: string;
  pictureUrl: string;
  informationUrl: string;
  metaData: {[key: string]: string | number | boolean | Object};
  isPublic: boolean;
  lastMessage: string;
  lastMessageUpdated: string;
  messageCount: number;
  created: string;
  modified: string;
  users: IUserForRoom[] | null;
}

export interface IUserForRoom {
  userId: string;
  name: string;
  pictureUrl: string;
  informationUrl: string;
  metaData?: {[key: string]: string | number | boolean | Object};
  created: string;
  modified: string;
  ruUnreadCount: number;
  ruMetaData?: {[key: string]: string | number | boolean | Object};
  ruCreated: string;
  ruModified: string;
}

export interface IRoomUser {
  roomId: string;
  userId: string;
  unreadCount: number;
  metaData?: {[key: string]: string | number | boolean | Object}; 
  created: string;
  modified: string;
}

export interface IMessages {
  allCount: number;
  messages: IMessage[];
}

export interface IMessage {
  messageId?: string;
  roomId: string;
  userId: string;
  type: string;
  eventName: string;
  payload: Object;
  created?: string;
}

export interface ISendMessagesResponse {
  messageIds: string[] | null;
  error: IProblemDetail | null;
}

export interface ICloseEvent extends Event {
  code: number;
  reason: string;
}

export interface IMessageEvent extends Event {
  data: (String|Buffer|ArrayBuffer|Buffer[]);
  isBinary: boolean;
  target: WebSocket;
}

export interface IUISettings {
  menuHeight: number;
  textInteractionFontSize: number;
}

export interface IInvalidParam {
  name: string;
  reason: string;
}

export interface IProblemDetail {
  type?: string;
  title: string;
  status?: number;
  detail?: string;
  instance?: string;
  errorName?: string;
  invalidParams?: IInvalidParam[];
}

export interface IFetchUsersResponse {
  users: IUser[] | null;
  error: IProblemDetail | null;
}

export interface IFetchUserResponse {
  user: User | null;
  error: IProblemDetail | null;
}

export interface IFetchUserDeviceResponse {
  device: IDevice | null;
  error: IProblemDetail | null;
}

export interface IFetchRoomsResponse {
  rooms: IRoom[] | null;
  error: IProblemDetail | null;
}

export interface IFetchRoomResponse {
  room: Room | null;
  error: IProblemDetail | null;
}

export interface IFetchRoomUsersResponse {
  roomUsers: IRoomUser[] | null;
  error: IProblemDetail | null;
}

export interface IFetchMessagesResponse {
  messages: IMessages | null;
  error: IProblemDetail | null;
}

export interface IErrorResponse {
  error: IProblemDetail | null;
}
