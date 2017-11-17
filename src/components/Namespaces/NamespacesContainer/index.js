import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import nslogo from '../../../images/deploym.png';
import NavLink from "../../../containers/NavLink";
import { deleteNamespace } from "../../../actions/NamespaceActions/deleteNamespaceAction";
import DeleteModal from '../../CustomerModal/DeleteModal';
import Spinner from '../../Spinner';

import Notification from '../../../components/Notification';

class NamespacesContainer extends Component {
    constructor() {
        super();
        this.state = {
            isOpened: false,
            NSName: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.DeleteNamespaceReducer) {
            this.setState({
                ...this.state,
                NSName: '',
                isOpened: false
            });
        }
        if (nextProps.DeleteNamespaceReducer.isFetching === false &&
            nextProps.DeleteNamespaceReducer.status === 202 &&
            nextProps.DeleteNamespaceReducer.idName) {
            const id = `item_${nextProps.DeleteNamespaceReducer.idName}`;
            if (typeof window !== 'undefined') {
                const el = document.getElementById(id);
                el ? el.remove() : el;
            }
        }
    }
    handleClickTR(href) {
        if (typeof window !== 'undefined') {
            browserHistory.push('/Namespaces/' + href);
        }
    }
    handleClose(e) {
        e.stopPropagation();
    }
    handleClickDeletingNamespace(idName) {
        this.setState({
            ...this.state,
            NSName: idName,
            isOpened: true
        });
        // this.props.onDeleteNamespace(idName);
        // console.log(idName);
    }
    render() {
        let isFetchingDeleteNS = '';
        if (this.props.DeleteNamespaceReducer.isFetching) {
            isFetchingDeleteNS = <Spinner />;
        }
        return (
            <div>
                { isFetchingDeleteNS }
                 <Notification
                     status={this.props.DeleteNamespaceReducer.status}
                     name={this.props.DeleteNamespaceReducer.idName}
                     errorMessage={this.props.DeleteNamespaceReducer.errorMessage}
                 />
                <div className="row double">
                    {
                        this.props.PostsNamespacesDataReducer.map((item) => {
                            const name = item.name;
                            const volumeSize = item.volume_size ? item.volume_size : 0;
                            const volumeUsed = item.volume_used ? item.volume_used: 0;
                            // const nameFirstChar = name.substring(0, 1).toUpperCase();
                            const id = `item_${name}`;
                            return (
                                <div className="col-md-4" id={id} key={id}>
                                    <div
                                        className="content-block-container card-container hover-action"
                                        onClick={href => this.handleClickTR(item.name)}
                                    >
                                        <div className="content-block-header">
                                            <div className="content-block-header-label">
                                                <div className="content-block-header-img">
                                                    <img src={nslogo} alt=""/>
                                                </div>
                                                <div className="content-block-header-label__text content-block-header-label_main">{name}</div>
                                            </div>
                                            <div className="content-block-header-extra-panel" onClick={this.handleClose.bind(this)}>
                                                <div className="content-block-header-extra-panel dropdown no-arrow">
                                                    <i
                                                        className="content-block-header__more ion-more dropdown-toggle"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                    > </i>
                                                    <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                                        <NavLink
                                                            className="dropdown-item"
                                                            to={`/Namespaces/${name}/Resize`}
                                                        >Resize</NavLink>
                                                        <button
                                                            className="dropdown-item text-danger"
                                                            onClick={idName => this.handleClickDeletingNamespace(name)}
                                                        >Delete</button>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="content-block-content card-block">
                                            <div className="content-block__info-item ">
                                                <div className="content-block__info-name inline">RAM ( Usage / Total ) :&nbsp;</div>
                                                <div className="content-block__info-text inline">{item.memory} / {item.memory_limit} MB</div>
                                            </div>
                                            <div className="content-block__info-item">
                                                <div className="content-block__info-name inline">CPU ( Usage / Total ) :&nbsp;</div>
                                                <div className="content-block__info-text inline">{item.cpu} / {item.cpu_limit} m</div>
                                            </div>
                                            <div className="content-block__info-item">
                                                <div className="content-block__info-name inline">Volume ( Usage / Total ) :&nbsp;</div>
                                                <div className="content-block__info-text inline">{volumeUsed} / {volumeSize} GB</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    }
                    <div className="col-md-4 align-middle">
                        <NavLink to="/CreateNamespace" className="add-new-block content-block-content card-container hover-action ">
                            <div className="action"><i>+</i> Add a namespace</div>
                        </NavLink>
                    </div>
                </div>

                <DeleteModal
                    type="Namespace"
                    name={this.state.NSName}
                    isOpened={this.state.isOpened}
                    onHandleDelete={this.props.onDeleteNamespace}
                />
            </div>
        );
    }
}

NamespacesContainer.propTypes = {
    PostsNamespacesDataReducer: PropTypes.array
};

function mapStateToProps(state) {
    return {
        DeleteNamespaceReducer: state.DeleteNamespaceReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteNamespace: (idName) => {
            dispatch(deleteNamespace(idName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NamespacesContainer);
