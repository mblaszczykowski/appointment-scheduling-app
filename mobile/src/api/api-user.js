import axios from '../../axios';

const apiGetRequest = async (url, token) => {
    try {
        const response = await axios.get(url, {
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
        console.error(`Error fetching data from ${url}:`, error.response?.data || error.message);
        return error.response?.data || { error: 'Request failed' };
    }
};

const getUser = async (params, credentials) => {
    const url = `/api/users/${params.accountId}`;
    return await apiGetRequest(url, credentials.token);
};

const getAppointments = async (params, credentials) => {
    const url = `/api/appointments/user/${params.accountId}`;
    return await apiGetRequest(url, credentials.token);
};

export { getUser, getAppointments };
