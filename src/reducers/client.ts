import { ClientState } from '../stores/client';
import {
  SetClientAction,
  SetCurrentRoomAction,
  SetCurrentRoomIdAction,
  SetCurrentRoomNameAction,
  SetAuthParamsAction,
  SetIsMessageListLoadingAction,
  SET_CLIENT,
  SET_CURRENT_ROOM,
  SET_CURRENT_ROOM_ID,
  SET_CURRENT_ROOM_NAME,
  SET_AUTH_PARAMS,
  SET_IS_MESSAGELIST_LOADING,
  ClientActions,
} from '../actions/client';

const getInitialState = (): ClientState => ({
  client: null,
  currentRoom: null,
  currentRoomId: '',
  currentRoomName: '',
  userId: '',
  accessToken: '',
  isMessageListLoading: false,
});

export function client(state: ClientState = getInitialState(), action: ClientActions): ClientState {
  switch (action.type) {
    case SET_CLIENT:
      return Object.assign(
        {},
        state,
        {
          client: (action as SetClientAction).client,
        }
      );
    case SET_CURRENT_ROOM:
      return Object.assign(
        {},
        state,
        {
          currentRoom: (action as SetCurrentRoomAction).currentRoom,
        }
      );
    case SET_CURRENT_ROOM_ID:
      return Object.assign(
        {},
        state,
        {
          currentRoomId: (action as SetCurrentRoomIdAction).currentRoomId,
        }
      );
    case SET_CURRENT_ROOM_NAME:
      return Object.assign(
        {},
        state,
        {
          currentRoomName: (action as SetCurrentRoomNameAction).currentRoomName,
        }
      );
    case SET_AUTH_PARAMS:
      const setUserAuthParamsAction = action as SetAuthParamsAction;
      return Object.assign(
        {},
        state,
        {
          userId: setUserAuthParamsAction.userId,
          accessToken: setUserAuthParamsAction.accessToken,
        }
      );
    case SET_IS_MESSAGELIST_LOADING:
      return Object.assign(
        {},
        state,
        {
          isMessageListLoading: (action as SetIsMessageListLoadingAction).isMessageListLoading,
        }
      );
    default:
      return state;
  }
}