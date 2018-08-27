import { fork, ForkEffect } from 'redux-saga/effects';
import { assetSaga } from './asset';
// import { combinedSaga } from './combined';
import { messageSaga } from './message';
import { roomSaga } from './room';
import { routerSaga } from './router';
import { userSaga } from './user';
import { userRoomsAllSaga } from './userRoomsAll';
import { userRoomsUnreadSaga } from './userRoomsUnread';
import { userRoomsOnlineSaga } from './userRoomsOnline';

export function* rootSaga(): IterableIterator<ForkEffect> {
  yield fork(assetSaga);
  // yield fork(combinedSaga);
  yield fork(messageSaga);
  yield fork(roomSaga);
  yield fork(routerSaga);
  yield fork(userSaga);
  yield fork(userRoomsAllSaga);
  yield fork(userRoomsUnreadSaga);
  yield fork(userRoomsOnlineSaga);
}
