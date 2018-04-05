/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types/index';
import {
  RUN_SOLUTION_REQUESTING,
  RUN_SOLUTION_SUCCESS,
  RUN_SOLUTION_FAILURE
} from '../../constants/solutionConstants/runSolution';
import { webApiLogin } from '../../config/index';

const runSolutionsRequest = () => ({
  type: RUN_SOLUTION_REQUESTING,
  isFetching: true
});

const runSolutionsSuccess = data => ({
  type: RUN_SOLUTION_SUCCESS,
  isFetching: false,
  data
});

const runSolutionsFailure = err => ({
  type: RUN_SOLUTION_FAILURE,
  isFetching: false,
  err
});

export const fetchRunSolutions = (
  idName: string,
  idSol: string,
  axios: any,
  URL: string = webApiLogin
): ThunkAction => async (dispatch: Dispatch) => {
  const token = cookie.load('token') ? cookie.load('token') : null;
  const browser = cookie.load('browser') ? cookie.load('browser') : null;
  // console.log(token);

  dispatch(runSolutionsRequest());

  const response = await axios.post(
    `${URL}/solutions/run`,
    { namespace: idName, label: idSol },
    {
      headers: {
        Authorization: token,
        'User-Client': browser,
        'Content-Type': 'application/json'
      },
      validateStatus: status => status >= 200 && status <= 505
    }
  );
  const { status, data } = response;
  switch (status) {
    case 201: {
      dispatch(runSolutionsSuccess(data));
      break;
    }
    case 404: {
      dispatch(runSolutionsSuccess([]));
      break;
    }
    case 401: {
      dispatch(runSolutionsRequest());
      dispatch(push('/login'));
      break;
    }
    default: {
      dispatch(runSolutionsFailure(data.message));
    }
  }
};

export const fetchRunSolutionsIfNeeded = (
  idName: string,
  idSol: string
): ThunkAction => (dispatch: Dispatch, getState: GetState, axios: any) =>
  dispatch(fetchRunSolutions(idName, idSol, axios));
