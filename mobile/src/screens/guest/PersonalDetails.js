import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PersonalDetails = (props) => {
    const { formValues, setFormValues, handleSignup, previousStep } = props;

    const toggleDay = (day) => {
        const updatedDays = formValues.availableDays.includes(day)
            ? formValues.availableDays.filter(d => d !== day)
            : [...formValues.availableDays, day];
        setFormValues({ ...formValues, availableDays: updatedDays });
    };

    return (
        <Animatable.View animation="fadeInRight" className="flex-1 bg-[#3575EF]">
            <View className="flex-grow justify-end items-center">
                <Image
                    className="w-[60px] h-[60px] rounded-full"
                    source={require("../assets/logo.jpg")}
                />
            </View>
            <View className="flex-grow justify-center items-center">
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="calendarUrl"
                    placeholderTextColor="#fff"
                    value={formValues.calendarUrl}
                    onChangeText={(val) => setFormValues({ ...formValues, calendarUrl: val })}
                />
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="meetingLink"
                    placeholderTextColor="#fff"
                    value={formValues.meetingLink}
                    onChangeText={(val) => setFormValues({ ...formValues, meetingLink: val })}
                />

                <Text className="text-white bg-transparent mt-0.5">Select available hours</Text>
                <View className="w-[300px] flex-row bg-[#ffffff4d] rounded-[25px] p-0.75 m-2 justify-between items-center">
                    <TextInput
                        className="flex-1 h-[50px] text-white bg-transparent text-center"
                        keyboardType="numeric"
                        placeholder="From"
                        placeholderTextColor="#ffffffa0"
                        value={formValues.availableFromHour.toString()}
                        onChangeText={(val) => setFormValues({ ...formValues, availableFromHour: parseInt(val, 10) })}
                    />
                    <Text className="text-white mx-2">-</Text>
                    <TextInput
                        className="flex-1 h-[50px] text-white bg-transparent text-center"
                        keyboardType="numeric"
                        placeholder="To"
                        placeholderTextColor="#ffffffa0"
                        value={formValues.availableToHour.toString()}
                        onChangeText={(val) => setFormValues({ ...formValues, availableToHour: parseInt(val, 10) })}
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
                        onValueChange={(val) => setFormValues({ ...formValues, meetingDuration: val })}
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
                    className=" m-3.5 p-2.5 flex-row items-center justify-center"
                >
                    <MaterialIcons name="navigate-before" size={24} color="white" />
                    <Text className="text-[16px] font-extrabold text-white text-center">Go back</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};

export default PersonalDetails;
