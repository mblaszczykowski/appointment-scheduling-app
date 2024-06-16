import React, {useContext} from "react";
import {Image, ScrollView, Text, TextInput, View} from "react-native";
import * as Animatable from "react-native-animatable";
import ProfileContext from "../../../context/ProfileContext";
import Slider from "@react-native-community/slider";
import {useColorSchemeContext} from "../../../context/ColorSchemeContext";

const Profile = () => {
    const {profileState} = useContext(ProfileContext);
    const {colorScheme} = useColorSchemeContext();

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

    const daysOfWeek = availableDays.split(',');

    return (
        <Animatable.View animation="fadeInRight"
                         className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-[#3575EF]'}`}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View className="flex-grow justify-end items-center">
                    <Image
                        className="w-[140px] h-[140px] rounded-full"
                        source={{uri: profilePicture}}
                    />
                </View>
                <View className="flex-grow justify-center items-center">
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-3.5 font-light`}
                        placeholder="First Name"
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={firstname}
                        editable={false}
                    />
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-3.5 font-light`}
                        placeholder="Last Name"
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={lastname}
                        editable={false}
                    />
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-3.5 font-light`}
                        placeholder="Email"
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={email}
                        editable={false}
                    />
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-3.5 font-light`}
                        placeholder="Calendar URL"
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={calendarUrl}
                        editable={false}
                    />
                    <TextInput
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 text-[16px] ${colorScheme === 'dark' ? 'text-gray-300' : 'text-white'} m-3.5 font-light`}
                        placeholder="Meeting Link"
                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#fff'}
                        value={meetingLink}
                        editable={false}
                    />

                    <Text className="text-white bg-transparent mt-0.5">Available Hours</Text>
                    <View
                        className={`w-[300px] flex-row ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-0.75 m-2 justify-between items-center`}>
                        <TextInput
                            className="flex-1 h-[50px] text-white bg-transparent text-center"
                            placeholder="From"
                            placeholderTextColor="#ffffffa0"
                            value={availableFromHour.toString()}
                            editable={false}
                        />
                        <Text className="text-white mx-2">-</Text>
                        <TextInput
                            className="flex-1 h-[50px] text-white bg-transparent text-center"
                            placeholder="To"
                            placeholderTextColor="#ffffffa0"
                            value={availableToHour.toString()}
                            editable={false}
                        />
                    </View>

                    <Text className="text-white bg-transparent mt-2">Available Days</Text>
                    <View
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 m-2.5 flex-row flex-wrap justify-start`}>
                        {daysOfWeek.map((day, index) => (
                            <View key={index} className="p-2 m-1 rounded-lg bg-white text-black">
                                <Text className="text-center text-black">
                                    {day}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View
                        className={`w-[300px] ${colorScheme === 'dark' ? 'bg-[#4d4d4d]' : 'bg-[#ffffff4d]'} rounded-[25px] p-3 m-3.5`}>
                        <Text className="text-white text-center mb-2">Meeting Duration: {meetingDuration} min</Text>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={15}
                            maximumValue={120}
                            step={15}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            value={Number(meetingDuration)}
                            disabled={true}
                        />
                    </View>
                </View>
            </ScrollView>
        </Animatable.View>
    );
};

export default Profile;
