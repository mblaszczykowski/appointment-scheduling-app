import axios from '../../axios';
import {Platform} from "react-native";



const apiGetRequest = async (calendarUrl, token) => {
    let baseUrl;
    if(Platform.OS === "android"){
        baseUrl = `${process.env.ANDROID_BASE_URL}`
    }
    else {
        baseUrl = `${process.env.IOS_BASE_URL}`
    }
    calendarUrl = baseUrl + calendarUrl
    try {
        const response = await axios.get(calendarUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        /*
        // jesli token wygasl
        // zaloguj sie i sprobuj jeszcze raz
        // bo chyba taki problem wystepuje
        // albo sztucznie to     await signOut();
         */
        console.error(`Error fetching data from ${calendarUrl}:`, error.response?.data || error.message);
        return error.response?.data || { error: 'Request failed' };
    }
};

const apiPutRequest = async (url, data, token) => {
    let baseUrl;
    if (Platform.OS === "android") {
        baseUrl = `${process.env.ANDROID_BASE_URL}`;
    } else {
        baseUrl = `${process.env.IOS_BASE_URL}`;
    }
    url = baseUrl + url;

    try {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const response = await axios.put(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating data at ${url}:`, error.response?.data || error.message);
        return error.response?.data || { error: 'Request failed' };
    }
};

const getUser = async (params, credentials) => {
    const url = `/api/users/${params.accountId}`;
    return await apiGetRequest(url, credentials.token);
};

const setUser = async (uuid, userData, credentials) => {
    const url = `/api/users/${userData.id}`;
    return await apiPutRequest(url, userData, credentials.token);
};

const getAppointments = async (params, credentials) => {
    const url = `/api/appointments/user/${params.accountId}`;
    return await apiGetRequest(url, credentials.token);
};

export { getUser, setUser, getAppointments };
