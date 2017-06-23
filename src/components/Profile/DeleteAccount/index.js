import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteProfile } from '../../../actions/ProfileActions/deleteProfileActions';
const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(127, 127, 127, .8)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class DeleteAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            errorMsg: '',
            successMsg: ''
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
    }
    handleOnClickDeleteProfile(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(deleteProfile());
    }
    componentWillReceiveProps(nextProps) {
        let getAlert = document.getElementById('failDeleteAlert');
        let getSuccessfulAlert = document.getElementById('successfulDeleteAlert');
        if (nextProps.DeleteProfileReducer.data) {
            this.setState({
                ...this.state,
                successMsg: nextProps.DeleteProfileReducer.data
            });
            getSuccessfulAlert.style.display = 'block';
        } else if (nextProps.DeleteProfileReducer.errorMessage) {
            this.setState({
                ...this.state,
                errorMsg: nextProps.DeleteProfileReducer.errorMessage
            });
            getAlert.style.display = 'block';
        } else {
            getAlert.style.display = 'none';
            getSuccessfulAlert.style.display = 'none';
        }
    }
    render() {
        return (
            <div className="card mt-3">
                <div className="card-block c-table-card-block">
                    <table className="table i-table-card">
                        <tbody>
                            <tr>
                                <td style={{width: '230px'}}>
                                    <h2 id="delete-account">
                                        <a name="delete-account" className="anchor" href="#delete-account">Delete Account</a>
                                    </h2> <br/>
                                    <p>Warning: This will totally delete Your Apps and Data</p>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                </td>
                                <td style={{width: '200px'}}>
                                    <button onClick={this.openModal} className='btn btn-block c-btn-green' type='submit'>Delete</button>
                                    <Modal
                                        isOpen={this.state.modalIsOpen}
                                        onRequestClose={this.closeModal}
                                        style={customStyles}
                                        contentLabel='Delete'
                                    >
                                        <h3 className="text-left">Delete Account</h3>
                                        <p className="text-left">
                                            Account Deleting is irreversible. Enter your Containerum password to confirm <br/>
                                            you want to permanently delete this account and all included data.
                                        </p>
                                        <div id='failDeleteAlert' className='alert alert-danger mb-4 c-alert-danger'>
                                            { this.state.errorMsg }
                                        </div>
                                        <div id='successfulDeleteAlert' className='alert alert-success mb-4 c-alert-success'>
                                            { this.state.successMsg }
                                        </div>
                                        <div onClick={this.closeModal} className="i-close"></div>
                                        <form onSubmit={this.handleOnClickDeleteProfile.bind(this)}>
                                            <div className='card-block p-5 i-card-block-padding-2'>
                                                <div className='form-group i-mb-20 c-has-feedback-left'>
                                                    <input
                                                        ref='password'
                                                        id='password'
                                                        required='required'
                                                        type='password'
                                                        className='form-control'
                                                        placeholder='Password'
                                                    />
                                                    <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                </div>
                                                <div>
                                                    <button type='submit' className='btn pull-right c-btn-green'>Delete</button>
                                                    <button className='btn pull-right c-btn-green' onClick={this.closeModal}>Cancel</button>
                                                </div>
                                            </div>
                                        </form>
                                    </Modal>
                                </td>
                                <td>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

DeleteAccount.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        DeleteProfileReducer: state.DeleteProfileReducer
    }
}

export default connect(mapStateToProps)(DeleteAccount);
