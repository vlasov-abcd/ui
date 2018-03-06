/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import type { Connector } from 'react-redux';

import type { Dispatch, ReduxState } from '../../types';
import * as actionGetServices from '../../actions/servicesActions/getServices';
import * as actionDeleteService from '../../actions/serviceActions/deleteService';
import {
  GET_SERVICES_INVALID,
  GET_SERVICES_REQUESTING,
  GET_SERVICES_FAILURE,
  GET_SERVICES_SUCCESS
} from '../../constants/servicesConstants/getServices';
import {
  DELETE_SERVICE_SUCCESS,
  DELETE_SERVICE_REQUESTING
} from '../../constants/serviceConstants/deleteService';
import ServicesList from '../../components/ServicesList';
import Notification from '../Notification';

type Props = {
  getServicesReducer: Object,
  deleteServiceReducer: Object,
  fetchGetServicesIfNeeded: (idName: string) => void,
  fetchDeleteServiceIfNeeded: (idName: string, idSvr: string) => void,
  history: Object,
  match: Object
};

// Export this for unit testing more easily
export class Services extends PureComponent<Props> {
  constructor() {
    super();
    this.state = {
      displayedService: []
    };
  }
  componentDidMount() {
    const { fetchGetServicesIfNeeded, match } = this.props;
    fetchGetServicesIfNeeded(match.params.idName);
  }
  componentWillUpdate(nextProps) {
    if (
      this.props.getServicesReducer.readyStatus !==
        nextProps.getServicesReducer.readyStatus &&
      nextProps.getServicesReducer.readyStatus === GET_SERVICES_SUCCESS
    ) {
      this.setState({
        ...this.state,
        displayedService: nextProps.getServicesReducer.data
      });
    }
    if (
      this.props.deleteServiceReducer.readyStatus !==
        nextProps.deleteServiceReducer.readyStatus &&
      nextProps.deleteServiceReducer.readyStatus === DELETE_SERVICE_SUCCESS
    ) {
      const displayedSrv = this.state.displayedService.filter(
        service => nextProps.deleteServiceReducer.idSrv !== service.name
      );
      this.setState({
        ...this.state,
        displayedService: displayedSrv
      });
    }
  }
  handleDeleteService = idSrv => {
    const { match } = this.props;
    this.props.fetchDeleteServiceIfNeeded(match.params.idName, idSrv);
  };

  renderServicesList = () => {
    const { getServicesReducer, deleteServiceReducer, match } = this.props;
    // console.log('getServicesReducer.data', getServicesReducer.data);

    if (
      !getServicesReducer.readyStatus ||
      getServicesReducer.readyStatus === GET_SERVICES_INVALID ||
      getServicesReducer.readyStatus === GET_SERVICES_REQUESTING ||
      deleteServiceReducer.readyStatus === DELETE_SERVICE_REQUESTING
    ) {
      return (
        <div
          style={{
            height: '270px',
            margin: '0 30px',
            borderRadius: '2px',
            backgroundColor: '#f6f6f6'
          }}
        />
      );
    }

    if (getServicesReducer.readyStatus === GET_SERVICES_FAILURE) {
      return <p>Oops, Failed to load data of Services!</p>;
    }

    return (
      <ServicesList
        data={this.state.displayedService}
        handleDeleteService={idSrv => this.handleDeleteService(idSrv)}
        history={this.props.history}
        idName={match.params.idName}
      />
    );
  };

  render() {
    const { status, idSrv, err } = this.props.deleteServiceReducer;
    return (
      <div>
        <Notification status={status} name={idSrv} errorMessage={err} />
        <div className="content-block-content full">
          <div className="tab-content">
            <div className="tab-pane services active">
              {this.renderServicesList()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ getServicesReducer, deleteServiceReducer }: ReduxState) => ({
    getServicesReducer,
    deleteServiceReducer
  }),
  (dispatch: Dispatch) => ({
    fetchGetServicesIfNeeded: (idName: string) =>
      dispatch(actionGetServices.fetchGetServicesIfNeeded(idName)),
    fetchDeleteServiceIfNeeded: (idName: string, idSrv: string) =>
      dispatch(actionDeleteService.fetchDeleteServiceIfNeeded(idName, idSrv))
  })
);

export default connector(Services);