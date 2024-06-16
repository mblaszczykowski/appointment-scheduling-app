import React, { useContext, useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthContext from "../../context/AuthContext";
import { AUTH_ACTIONS } from "../../context/reducers/authReducer";
import { login } from "../../api/api-auth";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const Login = ({ navigation }) => {
    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';

    const [values, setValues] = useState({
        email: "",
        password: "",
        loading: false,
        error: "",
    });

    const { state, dispatch } = useContext(AuthContext);

    const handleSubmit = async () => {
        if (!values.email || !values.password) {
            setValues({ ...values, error: "Please provide e-mail and password" });
            return;
        }
        if (!validateEmail(values.email)) {
            setValues({ ...values, error: "Invalid email format" });
            return;
        }
        setValues({ ...values, error: "", loading: true });
        const user = {
            email: values.email,
            password: values.password,
        };
        try {
            const data = await login(user);
            setValues({ ...values, loading: false });
            dispatch({
                type: AUTH_ACTIONS.SIGN_IN,
                auth: data,
                color: "#7bc2ff"
            });
        } catch (error) {
            setValues({ ...values, loading: false, error: error.message !== undefined ? "Error occurred during login: " + error.message : 'Login failed. Check your internet connection.' });
        }
    };

    return (
        <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-[#3674EF]'}`}>
            <View className="flex-grow justify-end items-center">
                <Image
                    className="w-[75px] h-[75px] rounded-full"
                    source={require("../assets/logo.jpg")}
                />
            </View>
            <View className="flex-grow justify-center items-center">
                <TextInput
                    className={`w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#ffffff4d] text-white'}`}
                    value={values.email}
                    autoCapitalize="none"
                    onChangeText={(emailValue) => setValues({ ...values, email: emailValue })}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Email"
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                />
                <TextInput
                    className={`w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#ffffff4d] text-white'}`}
                    value={values.password}
                    autoCapitalize="none"
                    onChangeText={(passwordValue) => setValues({ ...values, password: passwordValue })}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                />
                {values.error !== "" && (
                    <Text className="text-red-500 text-[15px] font-medium">{values.error}</Text>
                )}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className={`w-[300px] rounded-[25px] m-3.5 p-2.5 ${isDarkMode ? 'bg-gray-300' : 'bg-[#fff]'}`}
                >
                    {values.loading ? (
                        <ActivityIndicator color={isDarkMode ? "white" : "black"} />
                    ) : (
                        <Text className={`text-[16px] font-extrabold text-center ${isDarkMode ? 'text-black' : 'text-black'}`}>Login</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("PasswordReset")} className="m-3">
                    <Text className={isDarkMode ? 'text-gray-300' : 'text-white'}>Forgot your password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("QrScaner")}
                    className={`w-[300px] rounded-[25px] m-3.5 p-2.5 ${isDarkMode ? 'bg-gray-300' : 'bg-[#fff]'}`}
                >
                    <Text className={`text-[16px] font-extrabold text-center ${isDarkMode ? 'text-black' : 'text-black'}`}>ScanQR</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-grow items-end justify-center py-4 flex-row">
                <Text className={`text-[16px] font-light ${isDarkMode ? 'text-gray-300' : 'text-[#ffffffb3]'}`}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text className={isDarkMode ? 'text-gray-300' : 'text-white'}>Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;
