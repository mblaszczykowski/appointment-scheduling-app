import axios from "../../axios";

const getProfile = async (params, credentials) => {
    try {
        const user = await axios.get(`/api/users/${params.accountId}`, {
            headers: {
                Authorization: `Bearer ${credentials.token}`,
            },
        });
        return user.data;
    } catch (err) {
        // jesli token wygasl
        // zaloguj sie i sprobuj jeszcze raz
        // bo chyba taki problem wystepuje
        // albo sztucznie to     await signOut();
        return err.user.data;
    }
};

const appointmentsByUser = async (params, credentials) => {
    try {
        const appointments = await axios.get(
            `/api/appointments/user/${params.accountId}`,
            {
                headers: {
                    Authorization: `Bearer ${credentials.token}`,
                },
            }
        );

        return appointments.data;
    } catch (err) {
        return err.appointments.data;
    }
};

export {getProfile, appointmentsByUser};
