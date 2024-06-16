import React from "react";
import moment from "moment";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import {useColorSchemeContext} from "../../context/ColorSchemeContext";

const UserAppointmentCard = ({ appointment, navigation }) => {
    const date = moment(appointment.startTime).format("ddd MMM Do YYYY");
    const startTime = moment(appointment.startTime).format("HH:mm");
    const endTime = moment(appointment.endTime).format("HH:mm");
    const bookerName = appointment.bookerName;
    const meetingNote = appointment.meetingNote;

    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';

    return (
        <View className="p-4">
            <Animatable.View animation="zoomIn" className="bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <TouchableOpacity>
                    <View className="flex-row p-4 md:p-6">
                        <Image
                            className="h-20 w-20 bg-gray-500 rounded-lg"
                            source={require("../assets/user.jpg")}
                        />
                        <View className="ml-4 flex-1">
                            <Text className="text-xl font-semibold text-gray-800 dark:text-neutral-300">
                                {bookerName}
                            </Text>
                            <Text className="text-sm font-medium text-blue-600 dark:text-blue-500">
                                {date}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <EvilIcons name="clock" size={16} color={isDarkMode ? "#888" : "#1c313a"} />
                                <Text className="text-sm font-extrabold ml-1 text-gray-800 dark:text-neutral-300">
                                    {startTime} - {endTime}
                                </Text>
                            </View>
                            <View className="flex-row items-center mt-2">
                                <EvilIcons name="comment" size={16} color={isDarkMode ? "#888" : "#1c313a"} />
                                <Text className="text-sm font-extrabold ml-1 text-gray-800 dark:text-neutral-300">
                                    {meetingNote}
                                </Text>
                            </View>
                            <View className="absolute bottom-0 right-0 p-2">
                                <MaterialIcons name="read-more" size={24} color={isDarkMode ? "#888" : "#1c313a"} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};

export default UserAppointmentCard;
