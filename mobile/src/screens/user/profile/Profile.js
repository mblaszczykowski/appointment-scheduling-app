import React, { useContext, useState, useEffect } from "react";
import { ScrollView, Image, Text, TextInput, View, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import ProfileContext from "../../../context/ProfileContext";
import Slider from "@react-native-community/slider";
import { Buffer } from "buffer";
import { setUser } from "../../../api/api-user";
import AuthContext from "../../../context/AuthContext";

const Profile = ({ toggleEditing, isEditing }) => {
    const { state } = useContext(AuthContext);
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
    } = profileState.profile || {};

    const [localFirstname, setLocalFirstname] = useState(firstname || "");
    const [localLastname, setLocalLastname] = useState(lastname || "");
    const [localEmail, setLocalEmail] = useState(email || "");
    const [localCalendarUrl, setLocalCalendarUrl] = useState(calendarUrl || "");
    const [localMeetingLink, setLocalMeetingLink] = useState(meetingLink || "");
    const [localAvailableFromHour, setLocalAvailableFromHour] = useState(availableFromHour?.toString() || "0");
    const [localAvailableToHour, setLocalAvailableToHour] = useState(availableToHour?.toString() || "0");
    const [localMeetingDuration, setLocalMeetingDuration] = useState(Number(meetingDuration) || 0);
    const [localAvailableDays, setLocalAvailableDays] = useState(availableDays ? availableDays.split(',') : []);

    useEffect(() => {
        setLocalFirstname(firstname || "");
        setLocalLastname(lastname || "");
        setLocalEmail(email || "");
        setLocalCalendarUrl(calendarUrl || "");
        setLocalMeetingLink(meetingLink || "");
        setLocalAvailableFromHour(availableFromHour?.toString() || "0");
        setLocalAvailableToHour(availableToHour?.toString() || "0");
        setLocalMeetingDuration(Number(meetingDuration) || 0);
        setLocalAvailableDays(availableDays ? availableDays.split(',') : []);
    }, [profileState]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const toggleDay = (day) => {
        const updatedDays = localAvailableDays.includes(day)
            ? localAvailableDays.filter(d => d !== day)
            : [...localAvailableDays, day];
        setLocalAvailableDays(updatedDays);
    };

    const updateProfile = async () => {
        const decodeJWT = (token) => {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error("Failed to decode token", error);
                return null;
            }
        };

        const getUserIdFromToken = (token) => {
            const decoded = decodeJWT(token);
            return decoded ? decoded.sub : null;
        };

        const userId = getUserIdFromToken(state.auth);
        const newUserData = {
            id: userId,
            firstname: localFirstname,
            lastname: localLastname,
            email: localEmail,
            calendarUrl: localCalendarUrl,
            meetingLink: localMeetingLink,
            availableFromHour: localAvailableFromHour,
            availableToHour: localAvailableToHour,
            availableDays: localAvailableDays.join(','),
            meetingDuration: localMeetingDuration
        };
        console.log(newUserData.meetingDuration);

        try {
            await setUser({ accountId: userId }, newUserData, { token: state.auth });
            alert('Profile updated successfully');
            toggleEditing();
        } catch (error) {
            console.error("Failed to update profile", error);
            alert('Failed to update profile');
        }
    };

    return (
        <Animatable.View animation="fadeInRight" className="flex-1 bg-[#3575EF]">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                <View className="flex-grow justify-end items-center" style={{ marginTop: 20, marginBottom: 20 }}>
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

                    <View style={{ marginBottom: 60 }}>
                        <TouchableOpacity
                            onPress={updateProfile}
                            style={{
                                backgroundColor: 'white',
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 5
                            }}
                        >
                            <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Animatable.View>
    );
};

export default Profile;
