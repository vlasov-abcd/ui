/* @flow */

import _ from 'lodash/fp';

import {
  GET_DEPLOYMENTS_RUNNING_SOLUTION_INVALID,
  GET_DEPLOYMENTS_RUNNING_SOLUTION_REQUESTING,
  GET_DEPLOYMENTS_RUNNING_SOLUTION_SUCCESS,
  GET_DEPLOYMENTS_RUNNING_SOLUTION_FAILURE
} from '../../constants/solutionsConstants/getDeploymentsRunningSolution';
import type { Action } from '../../types';

const initialState = {
  readyStatus: GET_DEPLOYMENTS_RUNNING_SOLUTION_INVALID,
  isFetching: false,
  data: [],
  err: null
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case GET_DEPLOYMENTS_RUNNING_SOLUTION_REQUESTING:
      return _.assign(state, {
        readyStatus: GET_DEPLOYMENTS_RUNNING_SOLUTION_REQUESTING,
        isFetching: action.isFetching,
        data: [],
        err: null
      });
    case GET_DEPLOYMENTS_RUNNING_SOLUTION_SUCCESS:
      return _.assign(state, {
        readyStatus: GET_DEPLOYMENTS_RUNNING_SOLUTION_SUCCESS,
        isFetching: action.isFetching,
        data: action.data,
        err: null
      });
    case GET_DEPLOYMENTS_RUNNING_SOLUTION_FAILURE:
      return _.assign(state, {
        readyStatus: GET_DEPLOYMENTS_RUNNING_SOLUTION_FAILURE,
        isFetching: action.isFetching,
        data: [],
        err: action.err
      });
    default:
      return state;
  }
};
