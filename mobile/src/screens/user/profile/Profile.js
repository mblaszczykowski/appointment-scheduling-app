import React, { useContext, useState, useEffect } from "react";
import { ScrollView, Image, Text, TextInput, View, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import ProfileContext from "../../../context/ProfileContext";
import Slider from "@react-native-community/slider";
import { Buffer } from "buffer";
import { setUser } from "../../../api/api-user";
import AuthContext from "../../../context/AuthContext";
import {useColorSchemeContext} from "../../../context/ColorSchemeContext";
import {useTranslation} from "react-i18next";

const Profile = ({ toggleEditing, isEditing }) => {
    const { state } = useContext(AuthContext);
    const { profileState } = useContext(ProfileContext);
    const {colorScheme} = useColorSchemeContext();
    const { t } = useTranslation();

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

    const daysOfWeek = {
        "Monday": t('screens.profile.monday'),
        "Tuesday": t('screens.profile.tuesday'),
        "Wednesday": t('screens.profile.wednesday'),
        "Thursday": t('screens.profile.thursday'),
        "Friday": t('screens.profile.friday'),
        "Saturday": t('screens.profile.saturday'),
        "Sunday": t('screens.profile.sunday')
    };

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
        <Animatable.View animation="fadeInRight"
                         className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-[#3575EF]'}`}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ width: '100%' , marginTop: 8 }}
                        showsVerticalScrollIndicator={false}>
                <View className="flex-grow justify-end items-center">
                    <Image
                        className="w-[140px] h-[140px] rounded-full"
                        source={{ uri: profilePicture }}
                        style={{ marginTop: 30, marginBottom: 30 }}
                    />
                </View>
                <View className="flex-grow justify-center items-center">
                    <Text className="text-white bg-transparent mt-2 dark:text-gray-300">
                        {t('screens.profile.firstName')}
                    </Text>
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-2 font-light`}
                        placeholder={t('screens.profile.firstName')}
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={localFirstname}
                        onChangeText={setLocalFirstname}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-2 dark:text-gray-300">
                        {t('screens.profile.lastName')}
                    </Text>
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-2 font-light`}
                        placeholder={t('screens.profile.lastName')}
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={localLastname}
                        onChangeText={setLocalLastname}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-2 dark:text-gray-300">
                        {t('screens.profile.email')}
                    </Text>
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-2 font-light`}
                        placeholder={t('screens.profile.email')}
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={localEmail}
                        onChangeText={setLocalEmail}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-2 dark:text-gray-300">
                        {t('screens.profile.calendarUrl')}
                    </Text>
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-2 font-light`}
                        placeholder={t('screens.profile.calendarUrl')}
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={localCalendarUrl}
                        onChangeText={setLocalCalendarUrl}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-2 dark:text-gray-300">
                        {t('screens.profile.meetingLink')}
                    </Text>
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-2 font-light`}
                        placeholder={t('screens.profile.meetingLink')}
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={localMeetingLink}
                        onChangeText={setLocalMeetingLink}
                        editable={isEditing}
                    />

                    <Text className="text-white bg-transparent mt-2 dark:text-gray-300">
                        {t('screens.profile.availableHours')}
                    </Text>
                    <View
                        className={`w-[300px] flex-row ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-0.75 m-2 justify-between items-center`}>
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

                    <Text className="text-white bg-transparent mt-2 dark:text-gray-300">
                        {t('screens.profile.availableDays')}
                    </Text>

                    <View
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 m-2 flex-row flex-wrap justify-start`}>
                        {Object.keys(daysOfWeek).map((day) => (
                            <TouchableOpacity
                                key={day}
                                className={`p-2 m-1 rounded-lg ${
                                    localAvailableDays.includes(day) ? 'bg-white text-black' : 'bg-transparent text-white'
                                }`}
                                onPress={() => isEditing && toggleDay(day)}
                            >
                                <Text
                                    className={`text-center ${
                                        localAvailableDays.includes(day) ? 'text-black' : 'text-white'
                                    }`}
                                >
                                    {daysOfWeek[day].slice(0, 3)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 m-3.5`}>
                        <Text className="text-center mb-2 text-white dark:text-gray-300">
                            {t('screens.profile.meetingDuration')}: {localMeetingDuration} min
                        </Text>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={15}
                            maximumValue={120}
                            step={15}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            value={localMeetingDuration}
                            onValueChange={setLocalMeetingDuration}
                            disabled={true}
                        />
                    </View>

                    {isEditing && (
                        <View style={{ marginBottom: 60 }}>
                            <TouchableOpacity
                                onPress={updateProfile}
                                className="bg-white dark:bg-gray-400 w-[300px] rounded-[25px] mb-3.5 p-2.5 flex-row items-center justify-center"
                            >
                                <Text className="text-[15px] font-extrabold text-center text-black">
                                    {t('screens.profile.submit')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </Animatable.View>
    );
};

export default Profile;
