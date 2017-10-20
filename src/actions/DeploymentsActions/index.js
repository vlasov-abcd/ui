import axios from 'axios';
import { browserHistory } from 'react-router';

import {
    DEPLOYMENTS_REQUEST,
    DEPLOYMENTS_SUCCESS,
    DEPLOYMENTS_FAILURE
} from '../../constants/DeploymentsConstants';

import {
    WEB_API
} from '../../constants/WebApi';

export function getDeployments(namespaceName) {
    return dispatch => {
        dispatch(requestGetDeployments());
        const token = localStorage.getItem('id_token');
        const browser = localStorage.getItem('id_browser');
        const api = WEB_API + '/api/namespaces/' + namespaceName + '/deployments';

        return axios.get(
            api,
            {
                headers: {
                    'Authorization': token,
                    'X-User-Fingerprint': browser,
                    'Content-Type': 'application/x-www-form-urlencode',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=-1, private'
                },
                validateStatus: (status) => status >= 200 && status <= 500
            }
        )
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                dispatch(receiveGetDeployments(response.data));
            } else if (response.status === 401) {
                localStorage.removeItem('id_token');
                browserHistory.push('/Login');
            } else if (response.status === 400) {
                browserHistory.push('/Namespaces');
            } else if (response.status === 404) {
                dispatch(receiveGetDeployments([]));
            } else {
                dispatch(failGetDeployments(response.data.message, response.status));
            }
        }).catch(err => console.log(err));
    };
}

function requestGetDeployments() {
    return {
        type: DEPLOYMENTS_REQUEST,
        isFetching: true
    };
}

function receiveGetDeployments(data) {
    return {
        type: DEPLOYMENTS_SUCCESS,
        isFetching: false,
        data
    };
}

function failGetDeployments(message, status) {
    return {
        type: DEPLOYMENTS_FAILURE,
        isFetching: false,
        message,
        status
    };
}
