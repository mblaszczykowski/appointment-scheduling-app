import axios from '../../axios';


const apiGetRequest = async (calendarUrl, token) => {
    calendarUrl = `${process.env.BASE_URL}` + calendarUrl
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
        return error.response?.data || {error: 'Request failed'};
    }
};

const apiPutRequest = async (url, data, token) => {
    url = `${process.env.BASE_URL}` + url;

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

const cancelMeeting = async (id, credentials) => {
    const url = `/api/appointments/cancel/${id}`;
    console.log(credentials);
    return await apiPutRequest(url, {}, credentials);
};

const getAppointments = async (params, credentials) => {
    const url = `/api/appointments/user/${params.accountId}`;
    return await apiGetRequest(url, credentials.token);
};

export { getUser, setUser, getAppointments, cancelMeeting };
