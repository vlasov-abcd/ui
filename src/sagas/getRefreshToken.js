/* @flow */

import { push } from 'react-router-redux';
import { call, put } from 'redux-saga/effects';
import cookie from 'react-cookies';

import refreshToken from './refreshToken';

export default function* loadRefreshToken() {
  const response = yield call(refreshToken);
  const { status, data } = response;
  switch (status) {
    case 200: {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      } = data;
      cookie.save('accessToken', newAccessToken, { path: '/' });
      cookie.save('refreshToken', newRefreshToken, { path: '/' });
      yield put({
        type: 'REFRESH_TOKEN_SUCCESS'
      });
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      break;
    }
    default: {
      cookie.remove('accessToken', { path: '/' });
      cookie.remove('refreshToken', { path: '/' });
      yield put(push('/login'));
    }
  }
}
