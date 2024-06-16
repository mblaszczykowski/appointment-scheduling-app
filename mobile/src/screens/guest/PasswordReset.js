import React, { useState } from "react";
import { sendResetMail } from "../../api/api-auth";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";
import { useTranslation } from 'react-i18next';

const PasswordReset = ({ navigation }) => {
    const [formValues, setFormValues] = useState({
        email: ""
    });
    const { t } = useTranslation();

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
    const { t } = useTranslation();

    return (
        <Animatable.View animation="fadeIn" duration={1500} className="flex-1 bg-[#3575EF] dark:bg-gray-900">
            <View className="flex-grow justify-end items-center">
                <Image className="w-[75px] h-[75px] rounded-full" source={require("../assets/logo.jpg")} />
            </View>

            <View className="justify-center items-center mt-14">
                <Text className="text-2xl font-bold mb-2 text-white">{t('screens.passwordReset.text.forgotPassword')}</Text>
                <Text className="text-white dark:text-gray-300">{t('screens.passwordReset.text.dontWorry')}</Text>
                <TextInput
                    className="w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light bg-[#ffffff4d] dark:bg-gray-700 text-white dark:text-white"
                    placeholder={t('screens.passwordReset.text.email')}
                    autoCapitalize="none"
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    value={formValues.email}
                    onChangeText={val => setFormValues({ ...formValues, email: val })}
                />
                <TouchableOpacity
                    disabled={!formValues.email}
                    className="w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center bg-white dark:bg-gray-300"
                    onPress={handleSendMail}
                >
                    <Text className="text-[16px] font-extrabold text-center text-black">{t('screens.passwordReset.text.next')}</Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View className="flex-grow items-end justify-center py-4 flex-row">
                <Text className="text-[16px] font-light text-[#ffffffb3] dark:text-gray-300">{t('screens.passwordReset.text.rememberedPassword')} </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className="text-white dark:text-gray-300">{t('screens.passwordReset.text.signIn')}</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};

export default PasswordReset;
