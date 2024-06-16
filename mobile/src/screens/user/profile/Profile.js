import React, { useContext, useState, useEffect } from "react";
import { ScrollView, Image, Text, TextInput, View, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import ProfileContext from "../../../context/ProfileContext";
import Slider from "@react-native-community/slider";

const Profile = ({ toggleEditing, isEditing }) => {
    const { profileState } = useContext(ProfileContext);

    const {
        firstname,
        lastname,
        email,
        calendarUrl,
        meetingLink,
        profilePicture,
        availableFromHour,
        availableToHour,
        availableDays,
        meetingDuration
    } = profileState.profile;

    const [localFirstname, setLocalFirstname] = useState(firstname);
    const [localLastname, setLocalLastname] = useState(lastname);
    const [localEmail, setLocalEmail] = useState(email);
    const [localCalendarUrl, setLocalCalendarUrl] = useState(calendarUrl);
    const [localMeetingLink, setLocalMeetingLink] = useState(meetingLink);
    const [localAvailableFromHour, setLocalAvailableFromHour] = useState(availableFromHour.toString());
    const [localAvailableToHour, setLocalAvailableToHour] = useState(availableToHour.toString());
    const [localMeetingDuration, setLocalMeetingDuration] = useState(Number(meetingDuration));
    const [localAvailableDays, setLocalAvailableDays] = useState(availableDays.split(','));

    useEffect(() => {
        setLocalFirstname(firstname);
        setLocalLastname(lastname);
        setLocalEmail(email);
        setLocalCalendarUrl(calendarUrl);
        setLocalMeetingLink(meetingLink);
        setLocalAvailableFromHour(availableFromHour.toString());
        setLocalAvailableToHour(availableToHour.toString());
        setLocalMeetingDuration(Number(meetingDuration));
        setLocalAvailableDays(availableDays.split(','));
    }, [profileState]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const toggleDay = (day) => {
        const updatedDays = localAvailableDays.includes(day)
            ? localAvailableDays.filter(d => d !== day)
            : [...localAvailableDays, day];
        setLocalAvailableDays(updatedDays);
    };

    return (
        <Animatable.View animation="fadeInRight" className="flex-1 bg-[#3575EF]">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ width: '100%' }}>
                <View className="flex-grow justify-end items-center">
                    <Image
                        className="w-[140px] h-[140px] rounded-full"
                        source={{ uri: profilePicture }}
                    />
                </View>
                <View className="flex-grow justify-center items-center">
                    <Text className="text-white bg-transparent mt-0.5">First Name</Text>
                    <TextInput
                        className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                        placeholder="First Name"
                        placeholderTextColor="#fff"
                        value={localFirstname}
                        onChangeText={setLocalFirstname}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-0.5">Last Name</Text>
                    <TextInput
                        className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                        placeholder="Last Name"
                        placeholderTextColor="#fff"
                        value={localLastname}
                        onChangeText={setLocalLastname}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-0.5">Email</Text>
                    <TextInput
                        className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                        placeholder="Email"
                        placeholderTextColor="#fff"
                        value={localEmail}
                        onChangeText={setLocalEmail}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-0.5">Calendar URL</Text>
                    <TextInput
                        className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                        placeholder="Calendar URL"
                        placeholderTextColor="#fff"
                        value={localCalendarUrl}
                        onChangeText={setLocalCalendarUrl}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-0.5">Meeting Link</Text>
                    <TextInput
                        className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                        placeholder="Meeting Link"
                        placeholderTextColor="#fff"
                        value={localMeetingLink}
                        onChangeText={setLocalMeetingLink}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-0.5">Available Hours</Text>
                    <View className="w-[300px] flex-row bg-[#ffffff4d] rounded-[25px] p-0.75 m-2 justify-between items-center">
                        <TextInput
                            className="flex-1 h-[50px] text-white bg-transparent text-center"
                            placeholder="From"
                            placeholderTextColor="#ffffffa0"
                            value={localAvailableFromHour}
                            onChangeText={setLocalAvailableFromHour}
                            editable={isEditing}
                        />
                        <Text className="text-white mx-2">-</Text>
                        <TextInput
                            className="flex-1 h-[50px] text-white bg-transparent text-center"
                            placeholder="To"
                            placeholderTextColor="#ffffffa0"
                            value={localAvailableToHour}
                            onChangeText={setLocalAvailableToHour}
                            editable={isEditing}
                        />
                    </View>

                    <Text className="text-white bg-transparent mt-2">Available Days</Text>
                    <View className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 m-2.5 flex-row flex-wrap justify-start">
                        {daysOfWeek.map((day) => (
                            <TouchableOpacity
                                key={day}
                                className={`p-2 m-1 rounded-lg ${
                                    localAvailableDays.includes(day) ? 'bg-blue-400' : 'bg-transparent'
                                }`}
                                onPress={() => isEditing && toggleDay(day)}
                            >
                                <Text
                                    className={`text-center ${
                                        localAvailableDays.includes(day) ? 'text-white' : 'text-black'
                                    }`}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-white text-center mb-2">Meeting Duration: {localMeetingDuration} min</Text>
                    <View className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 m-3.5">
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={15}
                            maximumValue={120}
                            step={15}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            value={localMeetingDuration}
                            onValueChange={setLocalMeetingDuration}
                            disabled={!isEditing}
                        />
                    </View>
                </View>
            </ScrollView>
        </Animatable.View>
    );
};

export default Profile;
