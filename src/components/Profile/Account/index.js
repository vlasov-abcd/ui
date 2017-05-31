import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUser } from '../../../actions/UserActions';
import { changePassword } from '../../../actions/ChangePasswordActions';

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
        transform: 'translate(-50%, -50%)',
        height: '500px'
    }
};

const customStylesPassword = {
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
        transform: 'translate(-50%, -50%)',
        height: '480px'
    }
};

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            modalPasswordIsOpen: false,
            data: [],
            errorMsg: '',
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openPasswordModal = this.openPasswordModal.bind(this);
        this.closePasswordModal = this.closePasswordModal.bind(this);
        this.submitUpdatedData = this.submitUpdatedData.bind(this);
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
    }
    openPasswordModal() {
        this.setState({modalPasswordIsOpen: true});
    }
    closePasswordModal() {
        this.setState({modalPasswordIsOpen: false});
    }
    submitUpdatedData(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        const updateData = {
            first_name: this.refs.first_name.value,
            last_name: this.refs.last_name.value,
            phone: this.refs.phone.value,
            address: this.refs.address.value,
        };
        // console.log(updateData);
        dispatch(getUser(updateData));
    }
    submitUpdatedPasswordData(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        const updatePasswordData = {
            current_password: this.refs.current_password,
            new_password: this.refs.new_password
        };
        console.log(updatePasswordData);
        // dispatch(changePassword(updatePasswordData));
    }
    render() {
        const userEmail = this.props.ProfileReducer.data.login ? this.props.ProfileReducer.data.login : '';
        return (
            <div className='container-fluid pt-3'>
                <div className='row'>
                    <div className="col-12">
                        <div className="card mt-3">
                            <div className="card-block c-table-card-block">
                                <table className="table i-table-card">
                                    <tbody>
                                    <tr>
                                        <td>
                                            Account
                                        </td>
                                        <td>
                                            {userEmail}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src='http://placehold.it/150x150' alt='...' className='img-rounded'/>
                                        </td>
                                        <td>
                                            {userEmail}
                                        </td>
                                        <td>
                                            <ul>
                                                <li>Plan: ULTRA</li>
                                                <li>Limits</li>
                                                <li>RAM: 8 GB</li>
                                                <li>STORAGE: 40 GB</li>
                                            </ul>
                                        </td>
                                        <td>
                                            <button onClick={this.openModal} className='btn btn-default' type='submit'>Edit Profile</button>
                                            <Modal
                                                isOpen={this.state.modalIsOpen}
                                                // onAfterOpen={this.afterOpenModal}
                                                onRequestClose={this.closeModal}
                                                style={customStyles}
                                                contentLabel='Edit Profile'
                                            >
                                                <h3 className="text-center">Edit your profile</h3>
                                                <div onClick={this.closeModal} className="i-close"></div>
                                                <form onSubmit={this.submitUpdatedData}>
                                                    <div className='card-block p-5'>
                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <input
                                                                ref='first_name'
                                                                required='required'
                                                                type='text'
                                                                className='form-control'
                                                                id='inlineFormInputFirstName'
                                                                placeholder='First Name'
                                                                defaultValue=''
                                                            />
                                                            <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                        </div>

                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <input
                                                                ref='last_name'
                                                                required='required'
                                                                type='text'
                                                                className='form-control'
                                                                id='inlineFormInputLastName'
                                                                placeholder='Last Name'
                                                                defaultValue=''
                                                            />
                                                            <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                        </div>

                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <div className='form-control'>
                                                                {userEmail}
                                                            </div>
                                                            <i className='c-form-control-icon fa fa-user'></i>
                                                        </div>

                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <input
                                                                ref='phone'
                                                                required='required'
                                                                type='text'
                                                                className='form-control'
                                                                id='inlineFormInputPhone'
                                                                placeholder='Phone'
                                                                defaultValue=''
                                                            />
                                                            <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                        </div>

                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <input
                                                                ref='address'
                                                                required='required'
                                                                type='text'
                                                                className='form-control'
                                                                id='inlineFormInputAddress'
                                                                placeholder='Address'
                                                                defaultValue=''
                                                            />
                                                            <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                        </div>
                                                        <button ref='button' type='submit' className='btn btn-block c-btn-green i-btn-login-strong'>Update profile</button>
                                                    </div>
                                                </form>
                                            </Modal>
                                            <br />
                                            <br />
                                            <button onClick={this.openPasswordModal} className='btn btn-default' type='submit'>Change Password</button>
                                            <Modal
                                                isOpen={this.state.modalPasswordIsOpen}
                                                onRequestClose={this.closePasswordModal}
                                                style={customStylesPassword}
                                                contentLabel='Change Password'
                                            >
                                                <h3 className="text-center">Change Password</h3>
                                                <div onClick={this.closePasswordModal} className="i-close"></div>
                                                <form onSubmit={this.submitUpdatedPasswordData}>
                                                    <div className='card-block p-5'>

                                                        <label className="i-label-size" htmlFor="current_password">Current Password</label>
                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <input
                                                                ref='current_password'
                                                                id='current_password'
                                                                required='required'
                                                                type='password'
                                                                className='form-control'
                                                                placeholder='Current Password'
                                                            />
                                                            <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                        </div>

                                                        <label className="i-label-size" htmlFor="new_password">New Password</label>
                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <input
                                                                ref='new_password'
                                                                id='new_password'
                                                                required='required'
                                                                type='password'
                                                                className='form-control'
                                                                placeholder='New Password'
                                                            />
                                                            <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                        </div>

                                                        <label className="i-label-size" htmlFor="confirm_password">Confirm new Password</label>
                                                        <div className='form-group i-mb-20 c-has-feedback-left'>
                                                            <input
                                                                ref='confirm_password'
                                                                id='confirm_password'
                                                                required='required'
                                                                type='password'
                                                                className='form-control'
                                                                placeholder='Confirm new Password'
                                                            />
                                                            <i className='c-form-control-icon fa fa-tag fa-1'></i>
                                                        </div>
                                                        <button ref='button' type='submit' className='btn btn-block c-btn-green i-btn-login-strong'>Update password</button>
                                                    </div>
                                                </form>
                                            </Modal>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Account.propTypes = {
    dispatch: PropTypes.func.isRequired,
    errorMessage: PropTypes.string
};

function mapStateToProps (state) {
    const { UserReducer } = state;
    const { ProfileReducer } = state;
    const { userErrorMessage } = UserReducer;

    return {
        userErrorMessage,
        ProfileReducer,
        UserReducer
    }
}

export default connect(mapStateToProps)(Account)
