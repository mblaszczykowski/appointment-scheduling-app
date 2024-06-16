import React, { useContext, useState } from "react";
import { login, register } from "../../api/api-auth";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Slider from "@react-native-community/slider";
import AuthContext from "../../context/AuthContext";
import { AUTH_ACTIONS } from "../../context/reducers/authReducer";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";
import { useTranslation } from 'react-i18next';

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validateUrl = (url) => {
    const re = /^(ftp|http|https):\/\/[^ "]+$/;
    return re.test(String(url).toLowerCase());
};

const isNumberInRange = (value, min, max) => {
    const number = Number(value);
    return !isNaN(number) && number >= min && number <= max;
};

const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
};

const Register = ({ navigation }) => {
    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    const [formValues, setFormValues] = useState({
        step: 1,
        firstName: "",
        lastName: "",
        email: "",
        calendarUrl: "",
        password: "",
        meetingLink: "",
        availableFromHour: "",
        availableToHour: "",
        availableDays: [],
        meetingDuration: "",
        loading: false,
        error: "",
    });

    const { dispatch } = useContext(AuthContext);

    const nextStep = () => {
        if (!formValues.email || !formValues.password || !formValues.firstName || !formValues.lastName) {
            setFormValues(prev => ({ ...prev, error: t("screens.register.text.allFieldsRequired") }));
            return;
        }
        if (!validateEmail(formValues.email)) {
            setFormValues(prev => ({ ...prev, error: t("screens.register.text.invalidEmail") }));
            return;
        }
        if (!validatePassword(formValues.password)) {
            setFormValues(prev => ({
                ...prev,
                error: t("screens.register.text.passwordRequirements")
            }));
            return;
        }
        setFormValues(prev => ({ ...prev, error: "", step: prev.step + 1 }));
    };

    const previousStep = () => {
        setFormValues(prev => ({ ...prev, step: prev.step - 1 }));
    };

    const handleSignup = () => {
        if (!formValues.calendarUrl || !formValues.meetingLink || !formValues.availableFromHour || !formValues.availableToHour || formValues.availableDays.length === 0 || !formValues.meetingDuration) {
            setFormValues(prev => ({ ...prev, error: t("screens.register.text.allFieldsRequired") }));
            return;
        }
        if (!validateUrl(formValues.meetingLink)) {
            setFormValues(prev => ({ ...prev, error: t("screens.register.text.invalidMeetingLink") }));
            return;
        }
        if (!isNumberInRange(formValues.availableFromHour, 0, 24) || !isNumberInRange(formValues.availableToHour, 0, 24)) {
            setFormValues(prev => ({ ...prev, error: t("screens.register.text.hoursBetween0and24") }));
            return;
        }
        if (Number(formValues.availableToHour) <= Number(formValues.availableFromHour)) {
            setFormValues(prev => ({ ...prev, error: t("screens.register.text.availableToGreaterThanFrom") }));
            return;
        }

        setFormValues(prev => ({ ...prev, loading: true, error: "" }));

        const user = {
            firstname: formValues.firstName || undefined,
            lastname: formValues.lastName || undefined,
            email: formValues.email || undefined,
            calendarUrl: formValues.calendarUrl || undefined,
            password: formValues.password || undefined,
            meetingLink: formValues.meetingLink || undefined,
            availableFromHour: formValues.availableFromHour || undefined,
            availableToHour: formValues.availableToHour || undefined,
            availableDays: formValues.availableDays.join(',') || undefined,
            meetingDuration: formValues.meetingDuration || undefined,
        };

        register(user).then(async data => {
            if (data && data.error) {
                setFormValues(prev => ({ ...prev, loading: false, error: data.error }));
            } else {
                const loginData = await login({ email: formValues.email, password: formValues.password });
                dispatch({
                    type: AUTH_ACTIONS.SIGN_IN,
                    auth: loginData,
                });
            }
        }).catch(error => {
            setFormValues(prev => ({
                ...prev,
                loading: false,
                error: error.message !== undefined ? t("screens.register.text.errorOccurred") + error.message : t("screens.register.text.registrationFailed")
            }));
        });
    };

    return formValues.step === 1 ? (
        <LoginDetails
            formValues={formValues}
            setFormValues={setFormValues}
            nextStep={nextStep}
            navigation={navigation}
        />
    ) : (
        <PersonalDetails
            formValues={formValues}
            setFormValues={setFormValues}
            handleSignup={handleSignup}
            previousStep={previousStep}
        />
    );
};

const LoginDetails = ({ formValues, setFormValues, nextStep, navigation }) => {
    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    return (
        <Animatable.View animation="fadeIn" duration={1500} className={`flex-1 bg-[#3575EF] dark:bg-gray-900`}>
            <View className="flex-grow justify-end items-center">
                <Image className="w-[75px] h-[75px] rounded-full" source={require("../assets/logo.jpg")} />
            </View>
            <View className="flex-grow justify-center items-center">
                <TextInput
                    className="w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light bg-[#ffffff4d] dark:bg-gray-700 text-white dark:text-white"
                    placeholder={t("screens.register.text.email")}
                    autoCapitalize="none"
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    value={formValues.email}
                    onChangeText={val => setFormValues({ ...formValues, email: val })}
                />
                <TextInput
                    className="w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light bg-[#ffffff4d] dark:bg-gray-700 text-white dark:text-white"
                    placeholder={t("screens.register.text.password")}
                    secureTextEntry
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    autoCapitalize="none"
                    value={formValues.password}
                    onChangeText={val => setFormValues({ ...formValues, password: val })}
                />
                <TextInput
                    className="w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light bg-[#ffffff4d] dark:bg-gray-700 text-white dark:text-white"
                    placeholder={t("screens.register.text.firstName")}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    autoCapitalize="none"
                    value={formValues.firstName}
                    onChangeText={val => setFormValues({ ...formValues, firstName: val })}
                />
                <TextInput
                    className="w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light bg-[#ffffff4d] dark:bg-gray-700 text-white dark:text-white"
                    placeholder={t("screens.register.text.lastName")}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    autoCapitalize="none"
                    value={formValues.lastName}
                    onChangeText={val => setFormValues({ ...formValues, lastName: val })}
                />
                {formValues.error !== "" && (
                    <Text className="text-red-500 text-[15px] font-medium">{formValues.error}</Text>
                )}
                <TouchableOpacity
                    onPress={nextStep}
                    className="bg-[#fff] dark:bg-gray-300 w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center"
                >
                    <Text className="text-[16px] font-extrabold text-center text-black">{t("screens.register.text.next")}</Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View className="flex-grow items-end justify-center py-4 flex-row">
                <Text className="text-[16px] font-light text-[#ffffffb3] dark:text-gray-300">{t("screens.register.text.alreadyHaveAccount")} </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className="text-white dark:text-gray-300">{t("screens.register.text.signin")}</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PersonalDetails = ({ formValues, setFormValues, handleSignup, previousStep }) => {
    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    const toggleDay = (day) => {
        const updatedDays = formValues.availableDays.includes(day)
            ? formValues.availableDays.filter(d => d !== day)
            : [...formValues.availableDays, day];
        setFormValues({ ...formValues, availableDays: updatedDays });
    };

    const selectBusinessHours = () => {
        setFormValues({ ...formValues, availableFromHour: "9", availableToHour: "17" });
    };

    const selectWeekdays = () => {
        setFormValues({ ...formValues, availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] });
    };

    return (
        <Animatable.View animation="fadeInRight" className="flex-1 bg-[#3575EF] dark:bg-gray-900">
            <View className="flex-grow justify-center items-center mt-8">
                <TextInput
                    className="w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light bg-[#ffffff4d] dark:bg-gray-700 text-white dark:text-white"
                    placeholder={t("screens.register.text.calendarUrl")}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    value={formValues.calendarUrl}
                    onChangeText={val => setFormValues({ ...formValues, calendarUrl: val })}
                />
                <TextInput
                    className="w-[300px] rounded-[25px] p-3 text-[16px] m-3.5 font-light bg-[#ffffff4d] dark:bg-gray-700 text-white dark:text-white"
                    placeholder={t("screens.register.text.meetingLink")}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#fff'}
                    value={formValues.meetingLink}
                    onChangeText={val => setFormValues({ ...formValues, meetingLink: val })}
                />

                <Text className="text-white bg-transparent mt-0.5 dark:text-gray-300">{t("screens.register.text.selectAvailableHours")}</Text>
                <View
                    className="w-[300px] flex-row rounded-[25px] p-0.75 m-2 justify-between items-center bg-[#ffffff4d] dark:bg-gray-700">
                    <TextInput
                        className="flex-1 h-[50px] bg-transparent text-center text-white"
                        keyboardType="numeric"
                        placeholder={t("screens.register.text.from")}
                        placeholderTextColor={isDarkMode ? '#aaa' : '#ffffffa0'}
                        value={formValues.availableFromHour.toString()}
                        onChangeText={val => setFormValues({ ...formValues, availableFromHour: val })}
                    />
                    <Text className="text-white mx-2">-</Text>
                    <TextInput
                        className="flex-1 h-[50px] bg-transparent text-center text-white"
                        keyboardType="numeric"
                        placeholder={t("screens.register.text.to")}
                        placeholderTextColor={isDarkMode ? '#aaa' : '#ffffffa0'}
                        value={formValues.availableToHour.toString()}
                        onChangeText={val => setFormValues({ ...formValues, availableToHour: val })}
                    />
                </View>
                <TouchableOpacity
                    onPress={selectBusinessHours}
                    className="bg-white dark:bg-gray-400 w-[300px] rounded-[25px] mb-3.5 p-2.5 flex-row items-center justify-center"
                >
                    <Text className="text-[15px] font-extrabold text-center text-black">{t("screens.register.text.selectBusinessHours")}</Text>
                </TouchableOpacity>

                <Text className="text-white bg-transparent mt-2 dark:text-gray-300">{t("screens.register.text.selectAvailableDays")}</Text>
                <View
                    className="w-[300px] rounded-[25px] p-3 m-2.5 flex-row flex-wrap justify-start bg-[#ffffff4d] dark:bg-gray-700">
                    {daysOfWeek.map((day) => (
                        <TouchableOpacity
                            key={day}
                            className={`p-2 m-1 rounded-lg ${formValues.availableDays.includes(day) ? 'bg-white text-black' : 'bg-transparent text-white'}`}
                            onPress={() => toggleDay(day)}
                        >
                            <Text
                                className={`text-center ${formValues.availableDays.includes(day) ? 'text-black' : 'text-white'}`}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    onPress={selectWeekdays}
                    className="bg-white dark:bg-gray-400 w-[300px] rounded-[25px] mb-3.5 p-2.5 flex-row items-center justify-center"
                >
                    <Text className="text-[15px] font-extrabold text-center text-black">{t("screens.register.text.selectWeekdays")}</Text>
                </TouchableOpacity>

                <View className="w-[300px] rounded-[25px] p-3 m-3.5 bg-[#ffffff4d] dark:bg-gray-700">
                    <Text className="text-center mb-2 text-white dark:text-gray-300">{t("screens.register.text.meetingDuration")}: {formValues.meetingDuration} min</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={15}
                        maximumValue={120}
                        step={15}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        value={Number(formValues.meetingDuration)}
                        onValueChange={val => setFormValues({ ...formValues, meetingDuration: val })}
                    />
                </View>

                {formValues.error !== "" && (
                    <Text className="text-red-500 text-[15px] font-medium">{formValues.error}</Text>
                )}
                <TouchableOpacity
                    disabled={formValues.loading}
                    className="w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center bg-[#fff] dark:bg-gray-300"
                    onPress={handleSignup}
                >
                    {formValues.loading ? (
                        <ActivityIndicator color={isDarkMode ? "black" : "black"} />
                    ) : (
                        <Text className="text-[16px] font-extrabold text-center text-black">{t("screens.register.text.signUp")}</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={previousStep}
                    disabled={formValues.loading}
                    className="m-3.5 p-2.5 flex-row items-center justify-center"
                >
                    <MaterialIcons name="navigate-before" size={24} color="white" />
                    <Text className="text-[16px] font-extrabold text-center text-white">{t("screens.register.text.goBack")}</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};

export default Register;
