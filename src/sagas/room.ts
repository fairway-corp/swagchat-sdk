import { takeLatest, call, put, select, ForkEffect } from 'redux-saga/effects';
import {
  IRoom,
  IFetchRoomResponse,
  IFetchRoomUsersResponse,
} from '../';
import {
  updateRoom,
  addRoomUsers,
  removeRoomUsers,
} from '../room';

import {
  FETCH_ROOM_REQUEST,
  UPDATE_ROOM_REQUEST,
  ADD_ROOM_USER_REQUEST,
  REMOVE_ROOM_USER_REQUEST,
  IFetchRoomRequestAction,
  IUpdateRoomRequestAction,
  IAddRoomUserRequestAction,
  IRemoveRoomUserRequestAction,
  fetchRoomRequestSuccessActionCreator,
  fetchRoomRequestFailureActionCreator,
  addRoomUserRequestSuccessActionCreator,
  addRoomUserRequestFailureActionCreator,
  removeRoomUserRequestSuccessActionCreator,
  removeRoomUserRequestFailureActionCreator,
} from '../actions/room';
import { fetchUserRequestActionCreator } from '../actions/user';
import { State } from '../stores';

function* gFetchRoomRequest(action: IFetchRoomRequestAction) {
  const state: State = yield select();
  const res: IFetchRoomResponse = yield call((roomId: string) => {
    return state.client.client!.getRoom(roomId);
  }, action.roomId);
  if (res.room) {
    yield put(fetchRoomRequestSuccessActionCreator(res.room));
  } else {
    yield put(fetchRoomRequestFailureActionCreator(res.error!));
  }
}

function* gUpdateRoomRequest(action: IUpdateRoomRequestAction) {
  const res: IFetchRoomResponse = yield call((putRoom: IRoom) => {
    return updateRoom(putRoom);
  }, action.putRoom);
  if (res.room) {
    yield put(fetchRoomRequestSuccessActionCreator(res.room));
  } else {
    yield put(fetchRoomRequestFailureActionCreator(res.error!));
  }
}

function* gAddRoomUserRequest(action: IAddRoomUserRequestAction) {
  const state: State  = yield select();
  if (state.room.room === null) {
    return;
  }
  let roomId: string;
  if (state.room.room.roomId === undefined) {
    return;
  } else {
    roomId = state.room.room.roomId;
  }
  const res: IFetchRoomUsersResponse = yield call((userIds: string[]) => {
    return addRoomUsers(roomId, userIds);
  }, action.userIds);
  if (res.roomUsers) {
    yield put(addRoomUserRequestSuccessActionCreator(res.roomUsers));
    yield put(fetchUserRequestActionCreator(state.user.user!.userId, state.user.user!.accessToken));
  } else {
    yield put(addRoomUserRequestFailureActionCreator(res.error!));
  }
}

function* gRemoveRoomUserRequest(action: IRemoveRoomUserRequestAction) {
  const state: State  = yield select();
  if (state.room.room === null) {
    return;
  }
  let roomId: string;
  if (state.room.room.roomId === undefined) {
    return;
  } else {
    roomId = state.room.room.roomId;
  }
  const res: IFetchRoomUsersResponse = yield call((userIds: string[]) => {
    return removeRoomUsers(roomId, userIds);
  }, action.userIds);
  if (res.roomUsers) {
    yield put(removeRoomUserRequestSuccessActionCreator(res.roomUsers));
    yield put(fetchUserRequestActionCreator(state.user.user!.userId, state.user.user!.accessToken));
    location.href = '#';
  } else {
    yield put(removeRoomUserRequestFailureActionCreator(res.error!));
  }
}

export function* roomSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(FETCH_ROOM_REQUEST, gFetchRoomRequest);
  yield takeLatest(UPDATE_ROOM_REQUEST, gUpdateRoomRequest);
  yield takeLatest(ADD_ROOM_USER_REQUEST, gAddRoomUserRequest);
  yield takeLatest(REMOVE_ROOM_USER_REQUEST, gRemoveRoomUserRequest);
}
