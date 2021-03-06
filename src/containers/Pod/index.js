/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import Helmet from 'react-helmet';
import _ from 'lodash/fp';
import className from 'classnames/bind';

import initSocket from '../../functions/getSockets';
import * as actionGetPod from '../../actions/podActions/getPod';
import * as actionDeletePod from '../../actions/podActions/deletePod';
import {
  GET_POD_FAILURE,
  GET_POD_INVALID,
  GET_POD_REQUESTING
} from '../../constants/podConstants/getPod';
import {
  DELETE_POD_SUCCESS,
  DELETE_POD_REQUESTING
} from '../../constants/podConstants/deletePod';
import scrollById from '../../functions/scrollById';
import type { Dispatch, ReduxState } from '../../types';
import PodList from '../../components/PodCard/PodList';
import PodInfo from '../../components/PodCard/PodInfo';
import Notification from '../Notification';
import NavigationHeaderItem from '../NavigationHeader';

import globalStyles from '../../theme/global.scss';
import {
  GET_NAMESPACES_FAILURE,
  GET_NAMESPACES_INVALID,
  GET_NAMESPACES_REQUESTING
} from '../../constants/namespacesConstants/getNamespaces';

const globalClass = className.bind(globalStyles);

const containerNoBack = globalClass('container', 'containerNoBackground');

type Props = {
  getPodReducer: Object,
  getNamespacesReducer: Object,
  deletePodReducer: Object,
  fetchGetPodIfNeeded: (idName: string, idDep: string, idPod: string) => void,
  fetchDeletePodIfNeeded: (idName: string, idPod: string) => void,
  match: Object,
  history: Object
};

// Export this for unit testing more easily
export class Pod extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      socket: {},
      logs: '',
      errorMessage: '',
      isLogViewed: false,
      closeFullScreen: false
    };
  }
  componentDidMount() {
    const { fetchGetPodIfNeeded, match, history } = this.props;
    const { idName, idDep, idPod } = match.params;
    fetchGetPodIfNeeded(idName, idDep, idPod);
    this.clientSocket = initSocket(idName, idPod);
    if (this.clientSocket) {
      this.clientSocket.onerror = () => this.onMessageFailure();
      this.clientSocket.onmessage = evt => {
        const resultString = evt.data
          .replace(/ +/g, '<br />')
          .replace(/\n+/g, '<br />');
        this.onMessageReceived(this.clientSocket, resultString);
      };
    } else {
      this.clientSocket.onerror = () => this.onMessageFailure();
    }

    if (history.location.search === '?logs=view') {
      this.setState({
        ...this.state,
        closeFullScreen: !this.state.closeFullScreen,
        isLogViewed: !this.state.isLogViewed
      });
    }
  }
  componentWillUpdate(nextProps) {
    if (
      this.props.deletePodReducer.readyStatus !==
        nextProps.deletePodReducer.readyStatus &&
      nextProps.deletePodReducer.readyStatus === DELETE_POD_SUCCESS
    ) {
      this.props.history.goBack();
    }
  }
  componentWillUnmount() {
    if (this.clientSocket) {
      this.clientSocket.close();
    }
  }
  onMessageReceived = (socket, data) => {
    this.setState({ socket, logs: this.state.logs + data });
  };
  onMessageFailure = () => {
    this.setState({
      ...this.state,
      errorMessage: 'Failed to connect to server'
    });
  };
  onHandleDelete = idPod => {
    const { fetchDeletePodIfNeeded, match } = this.props;
    fetchDeletePodIfNeeded(match.params.idName, idPod);
  };
  handleViewLogs = () => {
    this.setState({
      ...this.state,
      isLogViewed: !this.state.isLogViewed
    });
    setTimeout(() => {
      scrollById('endOfLogs');
    }, 500);
  };
  // handleCloseFullScreen = () => {
  //   this.setState({
  //     ...this.state,
  //     closeFullScreen: !this.state.closeFullScreen
  //   });
  // };
  clientSocket = socket => socket;

  renderPodInfo = () => {
    const {
      getPodReducer,
      getNamespacesReducer,
      deletePodReducer,
      match,
      history
    } = this.props;

    if (
      !getNamespacesReducer.readyStatus ||
      getNamespacesReducer.readyStatus === GET_NAMESPACES_INVALID ||
      getNamespacesReducer.readyStatus === GET_NAMESPACES_REQUESTING ||
      !getPodReducer.readyStatus ||
      getPodReducer.readyStatus === GET_POD_INVALID ||
      getPodReducer.readyStatus === GET_POD_REQUESTING ||
      deletePodReducer.readyStatus === DELETE_POD_REQUESTING
    ) {
      return (
        <div
          className={`${globalStyles.container} container`}
          style={{
            padding: '0',
            marginTop: '17px',
            marginBottom: '30px',
            backgroundColor: 'transparent'
          }}
        >
          <img
            src={require('../../images/ns-dep.svg')}
            alt="ns-dep"
            style={{ width: '100%' }}
          />
        </div>
      );
    }

    if (
      getNamespacesReducer.readyStatus === GET_NAMESPACES_FAILURE ||
      getPodReducer.readyStatus === GET_POD_FAILURE
    ) {
      return <p>Oops, Failed to load data of Pod!</p>;
    }

    return (
      <PodInfo
        data={getPodReducer.data}
        dataNamespace={getNamespacesReducer.data.find(
          namespace => namespace.id === match.params.idName
        )}
        handleDeletePod={idPod => this.onHandleDelete(idPod)}
        idName={match.params.idName}
        idDep={match.params.idDep}
        errorMessage={this.state.errorMessage}
        logs={this.state.logs}
        handleViewLogs={this.handleViewLogs}
        isLogViewed={this.state.isLogViewed}
        closeFullScreen={this.state.closeFullScreen}
        match={match}
        history={history}
      />
    );
  };
  renderPodList = () => {
    const { getPodReducer, deletePodReducer, match } = this.props;

    if (
      !getPodReducer.readyStatus ||
      getPodReducer.readyStatus === GET_POD_INVALID ||
      getPodReducer.readyStatus === GET_POD_REQUESTING ||
      deletePodReducer.readyStatus === DELETE_POD_REQUESTING
    ) {
      return (
        <div
          className={`${globalStyles.container} container`}
          style={{
            padding: '0',
            marginTop: '17px',
            marginBottom: '30px',
            backgroundColor: 'transparent'
          }}
        >
          <div className="row double">
            {new Array(2).fill().map(() => (
              <div className="col-md-6 px-0" key={_.uniqueId()}>
                <img
                  src={require('../../images/pods-cont.svg')}
                  style={{ width: '100%' }}
                  alt="pod"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (getPodReducer.readyStatus === GET_POD_FAILURE) {
      return <p>Oops, Failed to load data of Pod!</p>;
    }

    return (
      <PodList
        data={getPodReducer.data}
        handleDeletePod={idDep => this.onHandleDelete(idDep)}
        idName={match.params.idName}
        idDep={match.params.idDep}
      />
    );
  };

  render() {
    // console.log(this.state.logs);
    // const { socket } = this.state;
    // if (Object.keys(socket).length) {
    //   socket.onmessage = evt => {
    //     console.log(evt);
    //     this.onMessageReceived(socket, evt.data.split('\n'));
    //   };
    // }
    const { match } = this.props;
    const { status, idPod, err } = this.props.deletePodReducer;
    return (
      <div>
        <Helmet title={`Pod - ${match.params.idPod}`} />
        <Notification status={status} name={idPod} errorMessage={err} />
        <NavigationHeaderItem
          idName={match.params.idName}
          idDep={match.params.idDep}
          idPod={match.params.idPod}
        />
        {this.renderPodInfo()}
        <div className={globalStyles.contentBlock}>
          <div className={`${containerNoBack} container`}>
            {this.renderPodList()}
          </div>
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ getPodReducer, getNamespacesReducer, deletePodReducer }: ReduxState) => ({
    getPodReducer,
    getNamespacesReducer,
    deletePodReducer
  }),
  (dispatch: Dispatch) => ({
    fetchGetPodIfNeeded: (idName: string, idDep: string, idPod: string) =>
      dispatch(actionGetPod.fetchGetPodIfNeeded(idName, idDep, idPod)),
    fetchDeletePodIfNeeded: (idName: string, idPod: string) =>
      dispatch(actionDeletePod.fetchDeletePodIfNeeded(idName, idPod))
  })
);

export default connector(Pod);
