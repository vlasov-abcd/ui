/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types';
import {
  RESIZE_NAMESPACE_REQUESTING,
  RESIZE_NAMESPACE_SUCCESS,
  RESIZE_NAMESPACE_FAILURE
} from '../../constants/namespaceConstants/resizeNamespace';
// import isTokenExist from '../functions/isTokenExist';
import { webApi, routerLinks } from '../../config';

const resizeNamespaceRequest = () => ({
  type: RESIZE_NAMESPACE_REQUESTING,
  isFetching: true
});

const resizeNamespaceSuccess = (data, status, method, idName, label) => ({
  type: RESIZE_NAMESPACE_SUCCESS,
  isFetching: false,
  data,
  status,
  method,
  idName,
  label
});

const resizeNamespaceFailure = (err, status, idName) => ({
  type: RESIZE_NAMESPACE_FAILURE,
  isFetching: false,
  err,
  status,
  idName
});

const resizeNamespaceInvalidToken = () => ({
  type: 'GET_INVALID_TOKEN'
});

export const fetchResizeNamespace = (
  idName: string,
  tariff: string,
  axios: any,
  label: string,
  URL: string = webApi
): ThunkAction => async (dispatch: Dispatch) => {
  const browser = cookie.load('browser');
  const accessToken = cookie.load('accessToken');

  dispatch(resizeNamespaceRequest());

  const response = await axios.put(
    `${URL}/namespaces/${idName}`,
    {
      tariff_id: tariff
    },
    {
      headers: {
        'User-Client': browser,
        'User-Token': accessToken
        // 'Content-Type': 'application/json'
      },
      validateStatus: status => status >= 200 && status <= 505
    }
  );
  const { status, data, config } = response;
  switch (status) {
    case 200: {
      dispatch(resizeNamespaceSuccess(data, 202, config.method, idName, label));
      dispatch(push(routerLinks.namespaces));
      break;
    }
    case 400: {
      if (data.message === 'invalid token received') {
        dispatch(resizeNamespaceInvalidToken());
      } else if (data.message === 'invalid request body format') {
        dispatch(push(routerLinks.login));
      } else dispatch(resizeNamespaceFailure(data.message, status, idName));
      break;
    }
    default: {
      dispatch(resizeNamespaceFailure(data.message, status, idName));
    }
  }
};

export const fetchResizeNamespaceIfNeeded = (
  idName: string,
  tariff: string,
  label: string
): ThunkAction => (dispatch: Dispatch, getState: GetState, axios: any) =>
  dispatch(fetchResizeNamespace(idName, tariff, axios, label));
