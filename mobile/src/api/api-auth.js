import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../axios';

const storeToken = async (user) => {
    try {
        await AsyncStorage.setItem('auth', JSON.stringify(user));
    } catch (error) {
        console.error('Error storing the auth token:', error);
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('auth');
    } catch (error) {
        console.error('Error removing the auth token:', error);
    }
};

const login = async (user) => {
    try {
        const response = await axios.post('/api/auth/login', user);
        await storeToken(response.data);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
        return error.response?.data || {error: 'Login failed'};
    }
};

const register = async (user) => {
    try {
        const response = await axios.post('/api/users', user);
        return response.data;
    } catch (error) {
        console.error('Error registering:', error.response?.data || error.message);
        return error.response?.data || {error: 'Registration failed'};
    }
};

const logout = async () => {
    try {
        await removeToken();
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export {login, register, logout};
