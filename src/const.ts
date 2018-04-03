export enum Platform {
  IOS = 1,
  ANDROID = 2,
}

export enum RoomType {
  ONE_ON_ONE = 1,
  PRIVATE_ROOM = 2,
  PUBLIC_ROOM = 3,
  NOTICE_ROOM = 4,
}

export enum SpeechMode {
  WAKEUP_WEB_TO_WEB = 1,
  WAKEUP_WEB_TO_CLOUD = 2,
  WAKEUP_CLOUD_TO_CLOUD = 3,
  ALWAYS = 4,
  MANUAL = 5, // default
}

export enum Speech2Text {
  BROWSER = 1,
  WATSON = 2,
  GOOGLE = 3,
}