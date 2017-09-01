
import { IUser, IRoomForUser, IProblemDetail } from '../';

export interface IUserState {
  apiKey: string;
  apiEndpoint: string;
  realtimeEndpoint: string;
  userId: string;
  accessToken: string;
  user: IUser | null;
  userRooms: IRoomForUser[];
  users: IUser[];
  contacts: IUser[];
  selectContacts: {[key: string]: IUser};
  blocks: string[];
  problemDetail: IProblemDetail | null;
}