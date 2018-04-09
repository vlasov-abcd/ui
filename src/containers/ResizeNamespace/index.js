/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import type { Connector } from 'react-redux';
import Helmet from 'react-helmet';
import _ from 'lodash/fp';

import * as actionGetNamespacesTariffs from '../../actions/namespacesActions/getNamespacesTariffs';
import * as actionGetNamespace from '../../actions/namespaceActions/getNamespace';
import * as actionGetNamespaceAccess from '../../actions/namespaceActions/getNamespaceAccess';
import * as actionResizeNamespace from '../../actions/namespaceActions/resizeNamespace';
import {
  GET_NAMESPACES_TARIFFS_INVALID,
  GET_NAMESPACES_TARIFFS_REQUESTING,
  GET_NAMESPACES_TARIFFS_FAILURE
} from '../../constants/namespacesConstants/getNamespacesTariffs';
import {
  GET_NAMESPACE_INVALID,
  GET_NAMESPACE_REQUESTING,
  GET_NAMESPACE_FAILURE
} from '../../constants/namespaceConstants/getNamespace';
import {
  GET_NAMESPACE_ACCESS_INVALID,
  GET_NAMESPACE_ACCESS_REQUESTING,
  GET_NAMESPACE_ACCESS_FAILURE
} from '../../constants/namespaceConstants/getNamespaceAccess';
import type {
  Namespaces as NamespacesType,
  Dispatch,
  ReduxState
} from '../../types';
import TariffsNamespacesList from '../../components/TariffsNamespacesList';
import ResizeModal from '../../components/CustomerModal/ResizeModal';
import Notification from '../Notification';

type Props = {
  getNamespacesTariffsReducer: NamespacesType,
  getNamespaceReducer: Object,
  getNamespaceAccessReducer: Object,
  resizeNamespaceReducer: Object,
  fetchGetNamespacesTariffsIfNeeded: () => void,
  fetchGetNamespaceIfNeeded: (idName: string) => void,
  fetchGetNamespaceAccessIfNeeded: (idName: string) => void,
  fetchResizeNamespaceIfNeeded: (idName: string, tariff: string) => void,
  match: Object
};

// Export this for unit testing more easily
export class ResizeNamespace extends PureComponent<Props> {
  constructor() {
    super();
    this.state = {
      isOpened: false,
      NSTariffId: null,
      NSTariffName: null,
      NSTariffCpu: null,
      NSTariffMemory: null,
      NSTariffVolume: null,
      NSTariffPrice: null,
      NSTariffPricePerDay: null
    };
  }
  componentDidMount() {
    const {
      match,
      fetchGetNamespacesTariffsIfNeeded,
      fetchGetNamespaceIfNeeded,
      fetchGetNamespaceAccessIfNeeded
    } = this.props;
    fetchGetNamespacesTariffsIfNeeded();
    fetchGetNamespaceIfNeeded(match.params.idName);
    fetchGetNamespaceAccessIfNeeded(match.params.idName);
  }
  handleOpenCloseModal = () => {
    this.setState({
      ...this.state,
      isOpened: !this.state.isOpened
    });
  };
  handleSelectTariff = tariff => {
    const {
      id,
      label,
      cpuLimit,
      memoryLimit,
      volumeSize,
      price,
      pricePerDay
    } = tariff;
    this.setState({
      ...this.state,
      isOpened: true,
      NSTariffId: id,
      NSTariffName: label,
      NSTariffCpu: cpuLimit,
      NSTariffMemory: memoryLimit,
      NSTariffVolume: volumeSize,
      NSTariffPrice: price,
      NSTariffPricePerDay: pricePerDay
    });
  };

  renderTariffsNamespacesList = () => {
    const {
      getNamespacesTariffsReducer,
      getNamespaceReducer,
      getNamespaceAccessReducer
    } = this.props;
    if (
      !getNamespacesTariffsReducer.readyStatus ||
      getNamespacesTariffsReducer.readyStatus ===
        GET_NAMESPACES_TARIFFS_INVALID ||
      getNamespacesTariffsReducer.readyStatus ===
        GET_NAMESPACES_TARIFFS_REQUESTING ||
      (!getNamespaceReducer.readyStatus ||
        getNamespaceReducer.readyStatus === GET_NAMESPACE_INVALID ||
        getNamespaceReducer.readyStatus === GET_NAMESPACE_REQUESTING) ||
      (!getNamespaceAccessReducer.readyStatus ||
        getNamespaceAccessReducer.readyStatus ===
          GET_NAMESPACE_ACCESS_INVALID ||
        getNamespaceAccessReducer.readyStatus ===
          GET_NAMESPACE_ACCESS_REQUESTING)
    ) {
      return (
        <div className="row">
          {new Array(8).fill().map(() => (
            <div key={_.uniqueId()} className="col-md-3">
              <div className="namespace-plan-block-placeholder">
                <img
                  src={require('../../images/add-ns-block.svg')}
                  alt="add-ns"
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (
      getNamespacesTariffsReducer.readyStatus ===
        GET_NAMESPACES_TARIFFS_FAILURE ||
      getNamespaceReducer.readyStatus === GET_NAMESPACE_FAILURE ||
      getNamespaceAccessReducer.readyStatus === GET_NAMESPACE_ACCESS_FAILURE
    ) {
      return <p>Oops, Failed to load data of Namespace!</p>;
    }

    return (
      <TariffsNamespacesList
        data={this.props.getNamespacesTariffsReducer.data}
        NSTariffName={this.state.NSTariffName}
        isFullDataOfProfile
        active={
          getNamespaceAccessReducer.data
            ? getNamespaceAccessReducer.data.tariff_id
            : null
        }
        handleSelectTariff={tariff => this.handleSelectTariff(tariff)}
        handleClickSelectTariff={this.handleOpenCloseModal}
      />
    );
  };

  render() {
    const {
      resizeNamespaceReducer,
      fetchResizeNamespaceIfNeeded,
      match
    } = this.props;
    const {
      NSTariffId,
      NSTariffName,
      NSTariffCpu,
      NSTariffMemory,
      NSTariffVolume,
      NSTariffPrice,
      NSTariffPricePerDay,
      isOpened
    } = this.state;
    const { status, idName, method, err } = resizeNamespaceReducer;
    return (
      <div>
        <Notification
          status={status}
          name={idName}
          method={method}
          errorMessage={err}
        />
        <ResizeModal
          type="Namespace"
          tariff={NSTariffName}
          id={NSTariffId}
          name={match.params.idName}
          data={{
            cpu: NSTariffCpu,
            memory: NSTariffMemory,
            volume: NSTariffVolume,
            price: NSTariffPrice,
            pricePerDay: NSTariffPricePerDay
          }}
          isOpened={isOpened}
          handleOpenCloseModal={this.handleOpenCloseModal}
          onHandleResize={fetchResizeNamespaceIfNeeded}
        />
        <Helmet title={`Resize Namespace - ${match.params.idName}`} />
        <div className="content-block">
          <div className="content-block-container container no-back mt-0 no-padding">
            <div className="content-block-content mt-0">
              <div className="namespace-plan mt-0">
                <div className="namespace-plan-title">
                  choose a namespace size for{' '}
                  <span className="namespace-plan-first-step-blue">
                    {match.params.idName}
                  </span>
                </div>
              </div>
              {this.renderTariffsNamespacesList()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({
    getNamespacesTariffsReducer,
    resizeNamespaceReducer,
    getNamespaceReducer,
    getNamespaceAccessReducer
  }: ReduxState) => ({
    getNamespacesTariffsReducer,
    getNamespaceReducer,
    resizeNamespaceReducer,
    getNamespaceAccessReducer
  }),
  (dispatch: Dispatch) => ({
    fetchGetNamespacesTariffsIfNeeded: () =>
      dispatch(actionGetNamespacesTariffs.fetchGetNamespacesTariffsIfNeeded()),
    fetchResizeNamespaceIfNeeded: (idName: string, tariff: string) =>
      dispatch(
        actionResizeNamespace.fetchResizeNamespaceIfNeeded(idName, tariff)
      ),
    fetchGetNamespaceIfNeeded: (idName: string) =>
      dispatch(actionGetNamespace.fetchGetNamespaceIfNeeded(idName)),
    fetchGetNamespaceAccessIfNeeded: (idName: string) =>
      dispatch(actionGetNamespaceAccess.fetchGetNamespaceAccessIfNeeded(idName))
  })
);

export default connector(ResizeNamespace);
