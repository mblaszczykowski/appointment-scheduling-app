import React, { useState } from "react";
import { signup } from "../../api/api-auth";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Slider from "@react-native-community/slider";

const Register = ({ navigation }) => {
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

    const nextStep = () => {
        setFormValues(prev => ({ ...prev, step: prev.step + 1 }));
    };

    const previousStep = () => {
        setFormValues(prev => ({ ...prev, step: prev.step - 1 }));
    };

    const handleSignup = () => {
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

        signup(user).then(data => {
            setFormValues(prev => ({ ...prev, loading: false, error: "" }));
            if (data && data.error) {
                console.log(data.error);
                setFormValues(prev => ({ ...prev, error: data.error }));
            } else {
                navigation.navigate("Login");
            }
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

const LoginDetails = ({ formValues, setFormValues, nextStep, navigation }) => (
    <Animatable.View animation="fadeIn" duration={1500} className="flex-1 bg-[#3575EF]">
        <View className="flex-grow justify-end items-center">
            <Image className="w-[75px] h-[75px] rounded-full" source={require("../assets/logo.jpg")} />
        </View>
        <View className="flex-grow justify-center items-center">
            <TextInput
                className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                placeholder="Email"
                autoCapitalize="none"
                placeholderTextColor="#fff"
                value={formValues.email}
                onChangeText={val => setFormValues({ ...formValues, email: val })}
            />
            <TextInput
                className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#fff"
                autoCapitalize="none"
                value={formValues.password}
                onChangeText={val => setFormValues({ ...formValues, password: val })}
            />
            <TextInput
                className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                placeholder="First Name"
                placeholderTextColor="#fff"
                autoCapitalize="none"
                value={formValues.firstName}
                onChangeText={val => setFormValues({ ...formValues, firstName: val })}
            />
            <TextInput
                className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                placeholder="Last Name"
                placeholderTextColor="#fff"
                autoCapitalize="none"
                value={formValues.lastName}
                onChangeText={val => setFormValues({ ...formValues, lastName: val })}
            />
            <TouchableOpacity
                disabled={!formValues.email || !formValues.password}
                onPress={nextStep}
                className="bg-[#fff] w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center"
            >
                <Text className="text-[16px] font-extrabold text-black text-center">Next</Text>
                <MaterialIcons name="navigate-next" size={24} color="black" />
            </TouchableOpacity>
        </View>
        <View className="flex-grow items-end justify-center py-4 flex-row">
            <Text className="text-[#ffffffb3] text-[16px] font-light">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-white text-[16px] font-semibold">Signin</Text>
            </TouchableOpacity>
        </View>
    </Animatable.View>
);

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PersonalDetails = ({ formValues, setFormValues, handleSignup, previousStep }) => {
    const toggleDay = (day) => {
        const updatedDays = formValues.availableDays.includes(day)
            ? formValues.availableDays.filter(d => d !== day)
            : [...formValues.availableDays, day];
        setFormValues({ ...formValues, availableDays: updatedDays });
    };

    return (
        <Animatable.View animation="fadeInRight" className="flex-1 bg-[#3575EF]">
            <View className="flex-grow justify-end items-center">
                <Image className="w-[60px] h-[60px] rounded-full" source={require("../assets/logo.jpg")} />
            </View>
            <View className="flex-grow justify-center items-center">
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    placeholder="calendarUrl"
                    placeholderTextColor="#fff"
                    value={formValues.calendarUrl}
                    onChangeText={val => setFormValues({ ...formValues, calendarUrl: val })}
                />
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    placeholder="meetingLink"
                    placeholderTextColor="#fff"
                    value={formValues.meetingLink}
                    onChangeText={val => setFormValues({ ...formValues, meetingLink: val })}
                />

                <Text className="text-white bg-transparent mt-0.5">Select available hours</Text>
                <View className="w-[300px] flex-row bg-[#ffffff4d] rounded-[25px] p-0.75 m-2 justify-between items-center">
                    <TextInput
                        className="flex-1 h-[50px] text-white bg-transparent text-center"
                        keyboardType="numeric"
                        placeholder="From"
                        placeholderTextColor="#ffffffa0"
                        value={formValues.availableFromHour.toString()}
                        onChangeText={val => setFormValues({ ...formValues, availableFromHour: val })}
                    />
                    <Text className="text-white mx-2">-</Text>
                    <TextInput
                        className="flex-1 h-[50px] text-white bg-transparent text-center"
                        keyboardType="numeric"
                        placeholder="To"
                        placeholderTextColor="#ffffffa0"
                        value={formValues.availableToHour.toString()}
                        onChangeText={val => setFormValues({ ...formValues, availableToHour: val })}
                    />
                </View>

                <Text className="text-white bg-transparent mt-2">Select available days</Text>
                <View className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 m-2.5 flex-row flex-wrap justify-start">
                    {daysOfWeek.map((day) => (
                        <TouchableOpacity
                            key={day}
                            className={`p-2 m-1 rounded-lg ${
                                formValues.availableDays.includes(day) ? 'bg-white text-black' : 'bg-transparent text-white'
                            }`}
                            onPress={() => toggleDay(day)}
                        >
                            <Text
                                className={`text-center ${
                                    formValues.availableDays.includes(day) ? 'text-black' : 'text-white'
                                }`}
                            >
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 m-3.5">
                    <Text className="text-white text-center mb-2">Meeting Duration: {formValues.meetingDuration} min</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={15}
                        maximumValue={120}
                        step={15}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        value={formValues.meetingDuration}
                        onValueChange={val => setFormValues({ ...formValues, meetingDuration: val })}
                    />
                </View>

                {formValues.error !== "" && (
                    <Text className="text-[rgb(254,92,92)] text-[15px] font-light">{formValues.error}</Text>
                )}
                <TouchableOpacity
                    disabled={formValues.loading}
                    className="bg-[#fff] w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center"
                    onPress={handleSignup}
                >
                    {formValues.loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-[16px] font-extrabold text-black text-center">Sign Up</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={previousStep}
                    disabled={formValues.loading}
                    className="m-3.5 p-2.5 flex-row items-center justify-center"
                >
                    <MaterialIcons name="navigate-before" size={24} color="white" />
                    <Text className="text-[16px] font-extrabold text-white text-center">Go back</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};

export default Register;
