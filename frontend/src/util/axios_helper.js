import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const getAuthToken = () => {
    return window.localStorage.getItem('auth_token');
};

export const setAuthHeader = (token) => {
    if (token !== null) {
        window.localStorage.setItem("auth_token", token);
    } else {
        window.localStorage.removeItem("auth_token");
    }
};

export const getUserIdFromToken = () => {
    const token = getAuthToken();
    if (token == null || token === undefined) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.sub; // Adjust 'userId' based on the actual payload property name
    } catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = (method, url, data) => {

    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers = {'Authorization': `Bearer ${getAuthToken()}`};
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data
    });
};