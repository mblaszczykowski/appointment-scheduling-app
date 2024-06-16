import React, { useState } from "react";
import { sendResetMail } from "../../api/api-auth";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";

const PasswordReset = ({ navigation }) => {
    const [formValues, setFormValues] = useState({
        email: ""
    });

    const handleSendMail = () => {
        sendResetMail({ email: formValues.email }).then(data => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                navigation.navigate("Login");
            }
        });
    };

    return (
        <ResetDetails
            formValues={formValues}
            setFormValues={setFormValues}
            handleSendMail={handleSendMail}
            navigation={navigation}
        />
    );
};

const ResetDetails = ({ formValues, setFormValues, handleSendMail, navigation }) => {
    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';

    return (
        <Animatable.View animation="fadeIn" duration={1500} className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-[#3575EF]'}`}>
            <View className="flex-grow justify-end items-center">
                <Image className="w-[75px] h-[75px] rounded-full" source={require("../assets/logo.jpg")} />
            </View>

            <View className="justify-center items-center mt-14">
                <Text className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-white'}`}>Forgot your password?</Text>
                <Text className={isDarkMode ? 'text-gray-300' : 'text-white'}>Don't worry, enter your email address.</Text>
                <TextInput
                    className={`w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#ffffff4d] text-white'}`}
                    placeholder="Email"
                    autoCapitalize="none"
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    value={formValues.email}
                    onChangeText={val => setFormValues({ ...formValues, email: val })}
                />
                <TouchableOpacity
                    disabled={!formValues.email}
                    className={`w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center ${isDarkMode ? 'bg-gray-300' : 'bg-white'}`}
                    onPress={handleSendMail}
                >
                    <Text className={`text-[16px] font-extrabold text-center ${isDarkMode ? 'text-black' : 'text-black'}`}>Next</Text>
                    <MaterialIcons name="navigate-next" size={24} color={isDarkMode ? 'black' : 'black'} />
                </TouchableOpacity>
            </View>
            <View className="flex-grow items-end justify-center py-4 flex-row">
                <Text className={`text-[16px] font-light ${isDarkMode ? 'text-gray-300' : 'text-[#ffffffb3]'}`}>Remembered your password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className={isDarkMode ? 'text-gray-300' : 'text-white'}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};

export default PasswordReset;
