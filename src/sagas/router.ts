import { takeLatest, ForkEffect, select, put, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { IFetchUserResponse, Client } from '../';
import { State } from '../stores';
import { fetchRoomAndMessagesRequestActionCreator, fetchRoomAndMessagesRequestActionDispatch } from '../actions/combined';
import { fetchUserRequestFailureActionCreator } from '../actions/user';
import { fetchRoomRequestActionCreator } from '../actions/room';
import { clearModalActionCreator } from '../actions/style';
import { clearMessagesActionCreator } from '../actions/message';
import { fetchUserRequestSuccessActionCreator, fetchContactsRequestActionCreator, fetchUserRequestActionCreator } from '../actions/user';

function* gLocationChange() {
  const state: State = yield select();
  if (!state.router.location) {
    return;
  }

  if (!state.client.client!.user) {
    const res: IFetchUserResponse = yield call(() => {
      return state.client.client!.auth({
        userId: state.client.userId,
        accessToken: state.client.accessToken,
      });
    });
    if (res.user) {
      yield put(fetchUserRequestSuccessActionCreator(state.client.client!.user.data));
    } else {
      yield put(fetchUserRequestFailureActionCreator(res.error!));
    }
  }

  yield put(clearModalActionCreator());

  const pathname = state.router.location!.pathname;
  let roomListPathRegExp = state.setting.roomListRoutePath ? pathname.match(new RegExp('^' + state.setting.roomListRoutePath + '$')) : null;
  let messagePathRegExp = state.setting.messageRoutePath ? pathname.match(new RegExp('^' + state.setting.messageRoutePath)) : null;
  let roomSettingPathRegExp = state.setting.roomSettingRoutePath ? pathname.match(new RegExp('^' + state.setting.roomSettingRoutePath)) : null;
  let selectContactPathRegExp = state.setting.selectContactRoutePath ? pathname.match(new RegExp('^' + state.setting.selectContactRoutePath)) : null;

  if (roomListPathRegExp) {
    // RoomListPage
    yield put(clearMessagesActionCreator());
    yield put(fetchUserRequestActionCreator(state.client.client!.user.userId));
  } else if (messagePathRegExp || roomSettingPathRegExp) {
    let roomIds: RegExpMatchArray | null;
    if (messagePathRegExp) {
      // MessagePage
      yield put(clearMessagesActionCreator());
      roomIds = pathname.match(new RegExp(state.setting.messageRoutePath + '/([a-zA-z0-9-]+)'));
      if (roomIds) {
        if (Client.CONNECTION) {
          state.client.client!.onConnected = () => fetchRoomAndMessagesRequestActionDispatch(roomIds![1]);
        } else {
          yield put(fetchRoomAndMessagesRequestActionCreator(roomIds[1]));
        }
      }
    } else if (roomSettingPathRegExp) {
      // RoomSettingPage
      roomIds = pathname.match(new RegExp(state.setting.roomSettingRoutePath + '/([a-zA-z0-9-]+)'));
      if (roomIds) {
        yield put(fetchRoomRequestActionCreator(roomIds[1]));
      }
    }
  } else if (selectContactPathRegExp) {
    yield put(fetchContactsRequestActionCreator());
  }
}

export function* routerSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(LOCATION_CHANGE, gLocationChange);
}
