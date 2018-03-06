/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types/index';
import {
  GET_PROFILE_REPORT_REQUESTING,
  GET_PROFILE_REPORT_SUCCESS,
  GET_PROFILE_REPORT_FAILURE
} from '../../constants/profileConstants/getProfileReport';
import { webApi } from '../../config/index';

const getProfileReportRequest = () => ({
  type: GET_PROFILE_REPORT_REQUESTING,
  isFetching: true
});

const getProfileReportSuccess = data => ({
  type: GET_PROFILE_REPORT_SUCCESS,
  isFetching: false,
  data
});

const getProfileReportFailure = err => ({
  type: GET_PROFILE_REPORT_FAILURE,
  isFetching: false,
  err
});

export const fetchGetProfileReport = (
  page: string,
  axios: any,
  URL: string = webApi
): ThunkAction => async (dispatch: Dispatch) => {
  const token = cookie.load('token') ? cookie.load('token') : null;
  const browser = cookie.load('browser') ? cookie.load('browser') : null;

  dispatch(getProfileReportRequest());

  const response = await axios.get(`${URL}/api/profile/report?page=${page}`, {
    headers: {
      Authorization: token,
      'User-Client': browser,
      'Content-Type': 'application/x-www-form-urlencode',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, max-age=-1, private'
    },
    validateStatus: status => status >= 200 && status <= 505
  });
  const { status, data } = response;
  switch (status) {
    case 200: {
      dispatch(getProfileReportSuccess(data));
      break;
    }
    case 401: {
      dispatch(getProfileReportRequest());
      dispatch(push('/login'));
      break;
    }
    case 404: {
      dispatch(getProfileReportSuccess({ operations: [] }));
      break;
    }
    default: {
      dispatch(getProfileReportFailure(data.message));
    }
  }
};

export const fetchGetProfileReportIfNeeded = (page: string): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState,
  axios: any
) => dispatch(fetchGetProfileReport(page, axios));