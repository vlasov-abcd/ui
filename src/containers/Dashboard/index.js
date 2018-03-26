/* @flow */

import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'lodash/fp';

import type { Dispatch, ReduxState } from '../../types';
import * as actionGetNamespaces from '../../actions/namespacesActions/getNamespaces';
import * as actionGetSolutions from '../../actions/solutionsActions/getSolutions';
import * as actionGetCountDeployments from '../../actions/statisticsActions/getCountDeployments';
import * as actionGetCountServices from '../../actions/statisticsActions/getCountServices';
import * as actionGetCountPods from '../../actions/statisticsActions/getCountPods';
import {
  GET_SOLUTIONS_INVALID,
  GET_SOLUTIONS_REQUESTING,
  GET_SOLUTIONS_FAILURE,
  GET_SOLUTIONS_SUCCESS
} from '../../constants/solutionsConstants/getSolutions';
import {
  GET_NAMESPACES_INVALID,
  GET_NAMESPACES_REQUESTING,
  GET_NAMESPACES_FAILURE,
  GET_NAMESPACES_SUCCESS
} from '../../constants/namespacesConstants/getNamespaces';
import {
  GET_COUNT_DEPLOYMENTS_INVALID,
  GET_COUNT_DEPLOYMENTS_REQUESTING,
  GET_COUNT_DEPLOYMENTS_FAILURE
} from '../../constants/statisticsConstants/getCountDeploymentsConstants';
import {
  GET_COUNT_SERVICES_INVALID,
  GET_COUNT_SERVICES_REQUESTING,
  GET_COUNT_SERVICES_FAILURE
} from '../../constants/statisticsConstants/getCountServicesConstants';
import {
  GET_COUNT_PODS_INVALID,
  GET_COUNT_PODS_REQUESTING,
  GET_COUNT_PODS_FAILURE
} from '../../constants/statisticsConstants/getCountPodsConstants';
import {
  RUN_SOLUTION_INVALID,
  RUN_SOLUTION_SUCCESS,
  RUN_SOLUTION_FAILURE
} from '../../constants/solutionConstants/runSolution';
import NamespacesDashboardList from '../../components/NamespacesDashboardList';
import SolutionsDashboardList from '../../components/SolutionsDashboardList';
import CountDeploymentsInfo from '../../components/CountDeploymentsInfo';
import CountServicesInfo from '../../components/CountServicesInfo';
import CountPodsInfo from '../../components/CountPodsInfo';
import DashboardBlockInfo from '../../components/DashboardBlockInfo';
import DashboardBlockTourAndNews from '../../components/DashboardBlockTourAndNews';
import RunSolutionItem from '../RunSolution';

type Props = {
  history: Object,
  getNamespacesReducer: Object,
  getSolutionsReducer: Object,
  getCountDeploymentsReducer: Object,
  getCountServicesReducer: Object,
  getCountPodsReducer: Object,
  fetchGetNamespacesIfNeeded: () => void,
  fetchGetSolutionsIfNeeded: () => void,
  fetchGetCountDeploymentsIfNeeded: () => void,
  fetchGetCountServicesIfNeeded: () => void,
  fetchGetCountPodsIfNeeded: () => void
};

// Export this for unit testing more easily
export class Dashboard extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      idName: null,
      displayedNamespaces: [],
      currentSolution: null,
      isOpenedSelectNamespace: false,
      statusOfRunSolution: RUN_SOLUTION_INVALID
    };
  }
  componentDidMount() {
    const {
      fetchGetNamespacesIfNeeded,
      fetchGetSolutionsIfNeeded,
      fetchGetCountDeploymentsIfNeeded,
      fetchGetCountServicesIfNeeded,
      fetchGetCountPodsIfNeeded
    } = this.props;
    fetchGetNamespacesIfNeeded();
    fetchGetSolutionsIfNeeded();
    fetchGetCountDeploymentsIfNeeded();
    fetchGetCountServicesIfNeeded();
    fetchGetCountPodsIfNeeded();
  }
  componentWillUpdate(nextProps) {
    if (
      this.props.getNamespacesReducer.readyStatus !==
        nextProps.getNamespacesReducer.readyStatus &&
      nextProps.getNamespacesReducer.readyStatus === GET_NAMESPACES_SUCCESS
    ) {
      this.setState({
        ...this.state,
        displayedNamespaces: nextProps.getNamespacesReducer.data,
        idName: nextProps.getNamespacesReducer.data.length
          ? nextProps.getNamespacesReducer.data[0]
          : null
      });
    }
  }

  handleClickRunSolution = solutionName => {
    this.setState({
      ...this.state,
      currentSolution: solutionName,
      isOpenedSelectNamespace: true
    });
  };
  handleOpenCloseModal = () => {
    this.setState({
      ...this.state,
      isOpenedSelectNamespace: !this.state.isOpenedSelectNamespace,
      idName: this.state.displayedNamespaces.length
        ? this.state.displayedNamespaces[0]
        : null,
      statusOfRunSolution: RUN_SOLUTION_INVALID
    });
  };
  handleSelectNamespace = value => {
    const currentNamespace = this.state.displayedNamespaces.filter(
      ns => ns.name === value
    );
    this.setState({
      ...this.state,
      idName: currentNamespace ? currentNamespace[0] : null
    });
  };
  handleSolutionSuccess = () => {
    this.setState({
      ...this.state,
      statusOfRunSolution: RUN_SOLUTION_SUCCESS
    });
  };
  handleSolutionFailure = () => {
    this.setState({
      ...this.state,
      statusOfRunSolution: RUN_SOLUTION_FAILURE
    });
  };

  renderNamespacesList = () => {
    const { getNamespacesReducer, history } = this.props;
    if (
      !getNamespacesReducer.readyStatus ||
      getNamespacesReducer.readyStatus === GET_NAMESPACES_INVALID ||
      getNamespacesReducer.readyStatus === GET_NAMESPACES_REQUESTING
    ) {
      return (
        <div
          style={{
            height: '130px',
            margin: '10px 10px',
            borderRadius: '2px',
            backgroundColor: '#f6f6f6'
          }}
        />
      );
    }
    if (getNamespacesReducer.readyStatus === GET_NAMESPACES_FAILURE) {
      return <p>Oops, Failed to load data of Namespaces!</p>;
    }
    return (
      <NamespacesDashboardList
        data={getNamespacesReducer.data}
        history={history}
      />
    );
  };
  renderSolutionsList = () => {
    const { getSolutionsReducer, history } = this.props;
    if (
      !getSolutionsReducer.readyStatus ||
      getSolutionsReducer.readyStatus === GET_SOLUTIONS_INVALID ||
      getSolutionsReducer.readyStatus === GET_SOLUTIONS_REQUESTING
    ) {
      return (
        <div className="solution-containers-wrapper mt-30">
          {new Array(8).fill().map(() => (
            <div
              key={_.uniqueId()}
              className="solution-container pre-solution-container"
              style={{
                height: '240px',
                backgroundColor: '#f6f6f6'
              }}
            />
          ))}
        </div>
      );
    }
    if (getSolutionsReducer.readyStatus === GET_SOLUTIONS_FAILURE) {
      return <p>Oops, Failed to load data of Solutions!</p>;
    }
    return (
      <SolutionsDashboardList
        data={getSolutionsReducer.data}
        history={history}
        handleClickRunSolution={solutionName =>
          this.handleClickRunSolution(solutionName)
        }
      />
    );
  };
  renderCountDeploymentsInfo = () => {
    const { getCountDeploymentsReducer } = this.props;
    if (
      !getCountDeploymentsReducer.readyStatus ||
      getCountDeploymentsReducer.readyStatus ===
        GET_COUNT_DEPLOYMENTS_INVALID ||
      getCountDeploymentsReducer.readyStatus ===
        GET_COUNT_DEPLOYMENTS_REQUESTING
    ) {
      return (
        <div className="col-md-4">
          <div className="block-container top-block">
            <div
              style={{
                height: '67px',
                width: '100%',
                borderRadius: '2px',
                backgroundColor: 'rgb(246, 246, 246)'
              }}
            />
          </div>
        </div>
      );
    }
    if (
      getCountDeploymentsReducer.readyStatus === GET_COUNT_DEPLOYMENTS_FAILURE
    ) {
      return <p>Oops, Failed to load data of Deployments!</p>;
    }
    return (
      <CountDeploymentsInfo count={getCountDeploymentsReducer.data.count} />
    );
  };
  renderCountServicesInfo = () => {
    const { getCountServicesReducer } = this.props;
    if (
      !getCountServicesReducer.readyStatus ||
      getCountServicesReducer.readyStatus === GET_COUNT_SERVICES_INVALID ||
      getCountServicesReducer.readyStatus === GET_COUNT_SERVICES_REQUESTING
    ) {
      return (
        <div className="col-md-4">
          <div className="block-container top-block">
            <div
              style={{
                height: '67px',
                width: '100%',
                borderRadius: '2px',
                backgroundColor: 'rgb(246, 246, 246)'
              }}
            />
          </div>
        </div>
      );
    }
    if (getCountServicesReducer.readyStatus === GET_COUNT_SERVICES_FAILURE) {
      return <p>Oops, Failed to load data of Services!</p>;
    }
    return <CountServicesInfo count={getCountServicesReducer.data.count} />;
  };
  renderCountPodsInfo = () => {
    const { getCountPodsReducer } = this.props;
    if (
      !getCountPodsReducer.readyStatus ||
      getCountPodsReducer.readyStatus === GET_COUNT_PODS_INVALID ||
      getCountPodsReducer.readyStatus === GET_COUNT_PODS_REQUESTING
    ) {
      return (
        <div className="col-md-4">
          <div className="block-container top-block">
            <div
              style={{
                height: '67px',
                width: '100%',
                borderRadius: '2px',
                backgroundColor: 'rgb(246, 246, 246)'
              }}
            />
          </div>
        </div>
      );
    }
    if (getCountPodsReducer.readyStatus === GET_COUNT_PODS_FAILURE) {
      return <p>Oops, Failed to load data of Pods!</p>;
    }
    return <CountPodsInfo count={getCountPodsReducer.data.count} />;
  };
  renderRunSolutionModal = () => {
    const { getNamespacesReducer, getSolutionsReducer } = this.props;
    if (
      getNamespacesReducer.readyStatus === GET_NAMESPACES_SUCCESS &&
      getSolutionsReducer.readyStatus === GET_SOLUTIONS_SUCCESS
    ) {
      const {
        currentSolution,
        isOpenedSelectNamespace,
        idName,
        displayedNamespaces,
        statusOfRunSolution
      } = this.state;
      return (
        <RunSolutionItem
          idName={idName}
          currentSolution={currentSolution}
          displayedNamespaces={displayedNamespaces}
          isOpenedSelectNamespace={isOpenedSelectNamespace}
          statusOfRunSolution={statusOfRunSolution}
          handleOpenCloseModal={this.handleOpenCloseModal}
          handleSelectNamespace={value => this.handleSelectNamespace(value)}
          handleSolutionFailure={this.handleSolutionFailure}
          handleSolutionSuccess={this.handleSolutionSuccess}
        />
      );
    }
    return null;
  };

  render() {
    const { getNamespacesReducer } = this.props;
    return (
      <div>
        <div>
          <Helmet title="Dashboard" />
          {this.renderRunSolutionModal()}
          <div className="container dashboard-wrap">
            <div className="row">
              <div className="col-md-9 pl-0">
                <div className="row">
                  {this.renderCountDeploymentsInfo()}

                  {this.renderCountServicesInfo()}

                  {this.renderCountPodsInfo()}

                  <DashboardBlockInfo />

                  <div className="col-md-10 col-namespaces">
                    <div className="block-container block-h">
                      <div className="top-block-header">Namespaces</div>
                      {this.renderNamespacesList()}
                    </div>
                  </div>
                </div>
              </div>

              <DashboardBlockTourAndNews
                linkToDeployment={
                  getNamespacesReducer.readyStatus === GET_NAMESPACES_SUCCESS &&
                  getNamespacesReducer.data.length
                    ? getNamespacesReducer.data[0].name
                    : ''
                }
              />
            </div>

            <div className="row">
              <div className="col-md-12 pl-0 pr-0">
                <div className="block-container block-container-tabs">
                  <div className="block-container-tabs-header">
                    Pre-Build Solutions
                  </div>
                  <ul
                    className="nav nav-pills mb-3"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        id="first-tab"
                        data-toggle="pill"
                        to="/dashboard"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        All
                      </NavLink>
                    </li>
                  </ul>

                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="first"
                      role="tabpanel"
                      aria-labelledby="first-tab"
                    >
                      {this.renderSolutionsList()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({
    getNamespacesReducer,
    getSolutionsReducer,
    getCountDeploymentsReducer,
    getCountServicesReducer,
    getCountPodsReducer
  }: ReduxState) => ({
    getNamespacesReducer,
    getSolutionsReducer,
    getCountDeploymentsReducer,
    getCountServicesReducer,
    getCountPodsReducer
  }),
  (dispatch: Dispatch) => ({
    fetchGetNamespacesIfNeeded: () =>
      dispatch(actionGetNamespaces.fetchGetNamespacesIfNeeded()),
    fetchGetSolutionsIfNeeded: () =>
      dispatch(actionGetSolutions.fetchGetSolutionsIfNeeded()),
    fetchGetCountDeploymentsIfNeeded: () =>
      dispatch(actionGetCountDeployments.fetchGetCountDeploymentsIfNeeded()),
    fetchGetCountServicesIfNeeded: () =>
      dispatch(actionGetCountServices.fetchGetCountServicesIfNeeded()),
    fetchGetCountPodsIfNeeded: () =>
      dispatch(actionGetCountPods.fetchGetCountPodsIfNeeded())
  })
);

export default connector(Dashboard);
