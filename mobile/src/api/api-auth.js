import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../axios';
import {Platform} from "react-native";

if(Platform.OS === "android"){
    axios.defaults.baseURL="http://10.0.2.2:8080"
}
else {
    axios.defaults.baseURL="http://localhost:8080"
}
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
        return error.response?.data || { error: 'Login failed' };
    }
};

const register = async (user) => {
    try {
        const response = await axios.post('/api/users', user);
        return response.data;
    } catch (error) {
        console.error('Error registering:', error.response?.data || error.message);
        return error.response?.data || { error: 'Registration failed' };
    }
};

const logout = async () => {
    try {
        await removeToken();
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export { login, register, logout };
