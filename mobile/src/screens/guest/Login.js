import React, {useContext, useState} from "react";
import {ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import AuthContext from "../../context/AuthContext";
import {AUTH_ACTIONS} from "../../context/reducers/authReducer";
import {login} from "../../api/api-auth";

const Login = ({navigation}) => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        loading: false,
        error: "",
    });

    const {state, dispatch} = useContext(AuthContext);

    const emptyField = !values.email || !values.password;

    const handleSubmit = () => {
        setValues({...values, error: "", loading: true});
        const user = {
            email: values.email || undefined,
            password: values.password || undefined,
        };
        login(user).then((data) => {
            setValues({...values, loading: false});
            if (data && data.error) {
                setValues({...values, error: data.error});
            } else {
                dispatch({
                    type: AUTH_ACTIONS.SIGN_IN,
                    auth: data,
                    color: "#7bc2ff"
                });
            }
        });
    };


    return (
        <View className="flex-1 bg-[#3674EF]">
            <View className="flex-grow justify-end items-center">
                <Image
                    className="w-[75px] h-[75px] rounded-full"
                    source={require("../assets/logo.jpg")}
                />
            </View>
            <View className="flex-grow justify-center items-center">
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    value={values.email}
                    autoCapitalize="none"
                    onChangeText={(emailValue) => setValues({...values, email: emailValue})}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Email"
                    placeholderTextColor="#fff"
                />
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    value={values.password}
                    autoCapitalize="none"
                    onChangeText={(passwordValue) => setValues({...values, password: passwordValue})}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#fff"
                />
                {values.error !== "" && (
                    <Text className="text-[rgb(254,92,92)] text-[15px] font-light">{values.error}</Text>
                )}
                <TouchableOpacity
                    disabled={values.loading || emptyField}
                    onPress={handleSubmit}
                    className="bg-[#fff] w-[300px] rounded-[25px] m-3.5 p-2.5"
                >
                    {values.loading ? (
                        <ActivityIndicator color="black"/>
                    ) : (
                        <Text className="text-[16px] font-extrabold text-black text-center">Login</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("PasswordReset")} className="m-3">
                    <Text style={{color: 'white'}}>Forgot your password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("QrScaner")}
                    className="bg-[#fff] w-[300px] rounded-[25px] m-3.5 p-2.5">
                    <Text className="text-[16px] font-extrabold text-black text-center">ScanQR</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-grow items-end justify-center py-4 flex-row">
                <Text className="text-[#ffffffb3] text-[16px] font-light">Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text className="text-white text-[16px] font-semibold">Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;
